import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActorService } from '../../../services/actor.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Actor } from '../../../interfaces/actor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideNativeDateAdapter } from '@angular/material/core';
import moment from 'moment';

@Component({
  selector: 'app-modal-actor',
  templateUrl: './modal-actor.component.html',
  styleUrl: './modal-actor.component.css',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalActorComponent {
  actorForm!: FormGroup;
  accionTitle: string = 'Agregar';
  accionButton: string = 'Guardar';

  constructor(private _formBuilder: FormBuilder, private _actorService: ActorService,
    private modalActual: MatDialogRef<ModalActorComponent>, private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public obActor: Actor,
  ){
    if(this.obActor != null){
      this.accionTitle = 'Editar';
      this.accionButton = 'Actualizar';
    }
  }

  ngOnInit(): void {
    this.actorForm = this.initForm();
    if(this.obActor != null){
      this.setDatos(this.obActor);
    }
  }
  
  initForm(): FormGroup{
    return this._formBuilder.group({
      cod_act: ['', [Validators.required, Validators.maxLength(4)]],
      nom_act: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      nom_rea_act: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      fec_nac_act: ['', [Validators.required]],
      fec_mue_act: [''],
      naciona_act: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(15)]]      
    });
  }
  
  setDatos(actor: Actor){
    this.actorForm.patchValue({
      cod_act: actor.cod_act,
      nom_act: actor.nom_act,
      nom_rea_act: actor.nom_rea_act,
      fec_nac_act: actor.fec_nac_act ? moment(actor.fec_nac_act, 'DD/MM/YYYY').toDate() : null,
      fec_mue_act: actor.fec_mue_act ? moment(actor.fec_mue_act, 'DD/MM/YYYY').toDate() : null,
      naciona_act: actor.naciona_act,
    });
  }

  guardarActor(){
    const _actor: Actor = {
      cod_act: this.obActor == null ? this.actorForm.value.cod_act : this.obActor.cod_act ,
      nom_act: this.actorForm.value.nom_act,
      nom_rea_act: this.actorForm.value.nom_rea_act,
      fec_nac_act: this.actorForm.value.fec_nac_act,
      fec_mue_act: this.actorForm.value.fec_mue_act,
      naciona_act: this.actorForm.value.naciona_act
    }
    if(this.obActor == null){
      this._actorService.createActor(_actor).subscribe({
        next: () =>{
          this._snackBar.open('Actor registrado con éxito', '', {
            duration: 1500,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.modalActual.close("true");
        },
        error: () => {
          this._snackBar.open('Error al registrar el actor', '', {
            duration: 1500,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });      
        }
      });
    }else{
      this._actorService.updateActor(_actor.cod_act, _actor).subscribe({
        next: () =>{
          this._snackBar.open('Actor actualizado con éxito', '', {
            duration: 1500,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
          this.modalActual.close("true");
        },
        error: () => {
          this._snackBar.open('Error al actualizar el actor', '', {
            duration: 1500,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });      
        }
      });
    }
  }
}
