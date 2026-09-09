import { Component } from "@angular/core";

import { RouterOutlet } from "@angular/router";

import { Sidebar } from "./shared/sidebar/sidebar";
import { Topbar } from "./shared/topbar/topbar";

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [RouterOutlet, Sidebar, Topbar],
  templateUrl: "./dashboard.html",
  styleUrl: "./dashboard.css",
})
export class Dashboard {}
