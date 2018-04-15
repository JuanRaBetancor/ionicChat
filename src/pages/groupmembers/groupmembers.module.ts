import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GroupmembersPage } from './groupmembers';

@NgModule({
  declarations: [
    GroupmembersPage,
  ],
  imports: [
    IonicPageModule.forChild(GroupmembersPage),
  ],
})
export class GroupmembersPageModule {}
