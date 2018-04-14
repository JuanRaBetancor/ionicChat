import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MainpagePage } from './mainpage';

@NgModule({
  declarations: [
    MainpagePage,
  ],
  imports: [
    IonicPageModule.forChild(MainpagePage),
  ],
})
export class MainpagePageModule {}
