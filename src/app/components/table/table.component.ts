import { AfterViewInit, Component, ViewChild, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnChanges {

  @Input() tableData: any;
  users: any;
  isAdmin: boolean = false;
  isTeamMember: boolean = false;
  displayedColumns: string[] = []; 
  displayedHeaders: string[] = [];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private apiService: ApiService) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.tableData.title === 'Users') {
      this.isAdmin = true;
      // Fetch user data from API
      this.apiService.genericGet('/get-users').subscribe((res: any) => {
        this.dataSource = new MatTableDataSource<any>(res);
      });
    } else if (this.tableData.title === 'Tasks') {
      this.isAdmin = false;
      this.apiService.genericGet('/get-members-tasks').subscribe((res: any) => {
        this.dataSource = new MatTableDataSource<any>(res);
      });
    }
    if (changes['tableData']) {
      this.dataSource = new MatTableDataSource(this.tableData.dataSource);
      this.displayedColumns = this.tableData.displayedColumns
      this.displayedHeaders = this.tableData.displayedHeaders
    }

  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
