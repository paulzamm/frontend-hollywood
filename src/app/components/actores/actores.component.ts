import { Component, ViewChild  } from '@angular/core';
import { Actor } from '../../interfaces/actor';
import { ActorService } from '../../services/actor.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalActorComponent } from './modal-actor/modal-actor.component';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import moment from 'moment';
import { format_Date } from '../shared/format-date';

@Component({
  selector: 'app-actores',
  templateUrl: './actores.component.html',
  styleUrl: './actores.component.css',
  providers:[
    { provide: MAT_DATE_FORMATS, useValue: format_Date }
  ]
})
export class ActoresComponent {
  
  
  actores: Actor[] = [];
  displayedColumns: string[] = ['id', 'nombre', 'nombreReal', 'fechaNacimiento', 'fechaMuerte', 'nacionalidad', 'acciones'];
  actorData = new MatTableDataSource<Actor>(this.actores);
  loading: boolean = false;
    
  @ViewChild(MatPaginator) paginatorTable!: MatPaginator;


  constructor(private _actorService: ActorService, private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getActores();
  }

  ngAfterViewInit(): void {
    this.actorData.paginator = this.paginatorTable;    
  }
  
  filterActorData(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.actorData.filter = filterValue.trim().toLowerCase();
  }
 
  getActores() {
    this.loading = true;
    this._actorService.getActores().subscribe(data => {
      this.actores = data.map(actor => ({
        ...actor,
        fec_nac_act: moment(actor.fec_nac_act).format('DD/MM/YYYY'),
        fec_mue_act: actor.fec_mue_act ? moment(actor.fec_mue_act).format('DD/MM/YYYY') : ''
      }));
      this.actorData.data = this.actores;
      this.actorData.paginator = this.paginatorTable;
      this.loading = false;
    });
  }
  
  createActor(){

    this._dialog.open(ModalActorComponent, {
      width: '550px',
      height: '500px',
      disableClose: true
    }).afterClosed().subscribe(result =>{
      if(result === 'true'){
        this.getActores();
      }
    });
  }

  updateActor(actor: Actor){
    this._dialog.open(ModalActorComponent, {
      disableClose: true,
      data: actor
    }).afterClosed().subscribe(result =>{
      if(result === 'true'){
        this.getActores();
      }
    });
  }

  deleteActor(id: string){
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Un actor eliminado no se puede recuperar',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed){
        this.loading = true;
    this._actorService.deleteActor(id).subscribe(() => {
      this.getActores();
      this._snackBar.open('Actor eliminado con éxito', '', {
        duration: 1500,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    });
      }
    });
  }
}

