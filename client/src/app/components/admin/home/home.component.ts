import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

//   displayedColumns: string[] = ['Description', 'IsExpense', 'Value', 'Actions'];
//   dataSource;

//   constructor(
//     private service: EntryService,
//     private dialog: MatDialog) { }

//   ngOnInit() {
//     this.service.getAll().subscribe((data) => {
//       console.log( data );
//       this.dataSource = new MatTableDataSource<EntryElement>(data as EntryElement[]);
//     });
//   }
// updateEntry(entry) {
//   console.log(home);
//   this.dialog.open(UpdateComponent, {
//     data: {
//       Id:          entry.Id,
//       Description: entry.Description,
//       IsExpense:   entry.IsExpense,
//       Value:       entry.Value
//     }
//   });
// }
ngOnInit() {
  }

}
