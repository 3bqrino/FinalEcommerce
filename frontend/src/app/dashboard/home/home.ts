import { ChangeDetectorRef, Component } from "@angular/core";
import { RecentOrders } from "./recent-orders/recent-orders";
import { LowStock } from "./low-stock/low-stock";
import { OverviewCard } from "./overview-card/overview-card";

@Component({
  selector: "app-dashboard-home",
  standalone: true,
  templateUrl: "./home.html",
  styleUrl: "./home.css",
  imports: [RecentOrders, LowStock, OverviewCard],
})
export class DashboardHome {
  constructor(private _cdr: ChangeDetectorRef) {}
}
