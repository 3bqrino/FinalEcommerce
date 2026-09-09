import { ChangeDetectorRef, Component, OnInit } from "@angular/core";

import { DatePipe } from "@angular/common";

import { IMessage } from "../../core/models/message.model";
import { MessageService } from "../../core/services/message.service";

@Component({
  selector: "app-messages",
  standalone: true,
  imports: [DatePipe],
  templateUrl: "./messages.html",
  styleUrl: "./messages.css",
})
export class Messages implements OnInit {
  messages: IMessage[] = [];

  errorMessage = "";

  constructor(
    private messageService: MessageService,
    private _cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.messageService.startPolling();

    this.messageService.messages$.subscribe((messages) => {
      this.messages = messages;

      this._cdr.detectChanges();
    });
  }

  markRead(id: string): void {
    this.messageService.markRead(id).subscribe({
      next: () => {
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message || "Failed to mark message as read";

        this._cdr.detectChanges();
      },
    });
  }

  deleteMessage(id: string): void {
    this.messageService.deleteMessage(id).subscribe({
      next: () => {
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || "Failed to delete message";

        this._cdr.detectChanges();
      },
    });
  }

  markAllRead(): void {
    this.messageService.markAllRead().subscribe({
      next: () => {
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage =
          err?.error?.message || "Failed to mark messages as read";

        this._cdr.detectChanges();
      },
    });
  }

  deleteAllRead(): void {
    this.messageService.deleteAllRead().subscribe({
      next: () => {
        this._cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || "Failed to delete messages";

        this._cdr.detectChanges();
      },
    });
  }

  getTypeClass(type: string): string {
    return type.replace("_", "-");
  }

  getTypeLabel(type: string): string {
    switch (type) {
      case "new_order":
        return "NEW ORDER";

      case "new_testimonial":
        return "NEW TESTIMONIAL";

      default:
        return "MESSAGE";
    }
  }
}
