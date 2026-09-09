import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";

@Component({
  selector: "app-quantity-selector",
  standalone: true,
  imports: [],
  templateUrl: "./quantity-selector.html",
  styleUrl: "./quantity-selector.css",
})
export class QuantitySelector {
  @Input() quantity = 1;

  @Input() max = 1;

  @Output() quantityChange = new EventEmitter<number>();

  constructor(private _cdr: ChangeDetectorRef) {}

  decrease(): void {
    if (this.quantity <= 1) {
      return;
    }

    this.quantity--;

    this.quantityChange.emit(this.quantity);

    this._cdr.detectChanges();
  }

  increase(): void {
    if (this.max <= 0) {
      return;
    }

    if (this.quantity >= this.max) {
      return;
    }

    this.quantity++;

    this.quantityChange.emit(this.quantity);

    this._cdr.detectChanges();
  }
}
