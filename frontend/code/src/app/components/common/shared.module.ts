import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgZorroAntdModule } from 'ng-zorro-antd';

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FlexLayoutModule, NgZorroAntdModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, FlexLayoutModule, NgZorroAntdModule],
  providers: [],
  declarations: [],
  entryComponents: []
})
export class SharedModule {}
