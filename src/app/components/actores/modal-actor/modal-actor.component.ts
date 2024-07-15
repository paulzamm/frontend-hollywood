import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActorService } from '../../../services/actor.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Actor } from '../../../interfaces/actor';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-modal-actor',
  templateUrl: './modal-actor.component.html',
  styleUrl: './modal-actor.component.css'
})
export class ModalActorComponent {
  actorForm!: FormGroup;
  accionTitle: string = 'Agregar';
  accionButton: string = 'Guardar';

  constructor(private _formBuilder: FormBuilder, private _actorService: ActorService,
    private modalActual: MatDialogRef<ModalActorComponent>, private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public actordata: Actor,
  ){
    if(this.actordata != null){
      this.accionTitle = 'Editar';
      this.accionButton = 'Actualizar';
    }
  }

  ngOnInit(): void {
    this.actorForm = this.initForm();
    if(this.actordata != null){
      this.setDatos();
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
  
  setDatos(){
    this.actorForm.patchValue({
      cod_act: this.actordata.cod_act,
      nom_act: this.actordata.nom_act,
      nom_rea_act: this.actordata.nom_rea_act,
      fec_nac_act: this.actordata.fec_nac_act,
      fec_mue_act: this.actordata.fec_mue_act,
      naciona_act: this.actordata.naciona_act,
    });
  }
  
  onSubmit(){

  }

  guardarActor(){
    const _actor: Actor = {
      cod_act: this.actordata == null ? '' : this.actordata.cod_act,
      nom_act: this.actorForm.value.nom_act,
      nom_rea_act: this.actorForm.value.nom_rea_act,
      fec_nac_act: this.actorForm.value.fec_nac_act,
      fec_mue_act: this.actorForm.value.fec_mue_act,
      naciona_act: this.actorForm.value.naciona_act
    }
    if(this.actordata == null){
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
