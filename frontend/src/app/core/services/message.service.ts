import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import {
  BehaviorSubject,
  Observable,
  Subject,
  interval,
  of,
  startWith,
  switchMap,
  tap,
  map,
  catchError,
  Subscription,
} from "rxjs";

import { environment } from "../../../environments/environment";
import { IMessage } from "../models/message.model";

@Injectable({
  providedIn: "root",
})
export class MessageService {
  private apiUrl = `${environment.apiUrl}/messages`;

  private messagesSubject = new BehaviorSubject<IMessage[]>([]);

  messages$ = this.messagesSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);

  unreadCount$ = this.unreadCountSubject.asObservable();

  private pollingSubscription?: Subscription;

  constructor(private http: HttpClient) {}

  getMessages(): Observable<IMessage[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map((res) => res?.data?.messages || []),
      tap((messages) => {
        this.setMessages(messages);
      }),
    );
  }

  markRead(id: string): Observable<IMessage> {
    return this.http.put<any>(`${this.apiUrl}/${id}/read`, {}).pipe(
      map((res) => res?.data?.message),
      tap((updatedMessage) => {
        if (!updatedMessage) {
          return;
        }

        const updated = this.messagesSubject.value.map((message) =>
          message._id === id ? updatedMessage : message,
        );

        this.setMessages(updated);
      }),
    );
  }

  deleteMessage(id: string): Observable<IMessage> {
    return this.http.put<any>(`${this.apiUrl}/${id}/delete`, {}).pipe(
      map((res) => res?.data?.message),
      tap(() => {
        const updated = this.messagesSubject.value.filter(
          (message) => message._id !== id,
        );

        this.setMessages(updated);
      }),
    );
  }

  markAllRead(): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/read-all`, {}).pipe(
      tap(() => {
        const updated = this.messagesSubject.value.map((message) => ({
          ...message,
          isRead: true,
        }));

        this.setMessages(updated);
      }),
    );
  }

  deleteAllRead(): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/delete-all-read`, {}).pipe(
      tap(() => {
        const updated = this.messagesSubject.value.filter(
          (message) => !message.isRead,
        );

        this.setMessages(updated);
      }),
    );
  }

  startPolling(): void {
    if (this.pollingSubscription) {
      return;
    }

    this.pollingSubscription = interval(5000)
      .pipe(
        startWith(0),
        switchMap(() => this.getMessages().pipe(catchError(() => of([])))),
      )
      .subscribe();
  }

  stopPolling(): void {
    this.pollingSubscription?.unsubscribe();

    this.pollingSubscription = undefined;
  }

  private setMessages(messages: IMessage[]): void {
    this.messagesSubject.next(messages);

    const unread = messages.filter(
      (message) => !message.isRead && !message.isDeleted,
    ).length;

    this.unreadCountSubject.next(unread);
  }
}
