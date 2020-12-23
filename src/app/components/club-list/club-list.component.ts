import { Component, OnInit } from '@angular/core';
import { ClubItemData } from 'src/app/models/club-item-data';
import { MemberItemData } from 'src/app/models/member-item-data';
import { ClubService } from 'src/app/services/club.service';
import { LoggerService } from 'src/app/services/logger.service';
import { MemberService } from 'src/app/services/member.service';
import * as uuid from 'uuid';

@Component({
  selector: 'club-list',
  templateUrl: './club-list.component.html',
  providers:[ ClubService]
})
export class ClubListComponent implements OnInit {
  clubs: ClubItemData[];
  editMemberCache: { [id: string]: { edit: boolean; data: MemberItemData } } = {};
  editClubCache: { [id: string]: { edit: boolean; data: ClubItemData } } = {};

  deleteClub(clubId: string){
    this.clubService.delete(clubId).subscribe(response =>{
      this.clubs = this.clubs.filter(club => club.club_id !== clubId);
    }, error => {
      //log the error
    });
  }

  startClubEdit(id: string): void {
    this.editClubCache[id].edit = true;
  }

  cancelClubEdit(clubId: string): void {
    const club = this.clubs.find(item => item.club_id === clubId);
  
      this.editClubCache[clubId] = {
        data: { ...club },
        edit: false
      };
  }

  saveClubEdit(clubId: string): void {
    const clubToSave = this.editClubCache[clubId].data;
    this.clubService.save(clubToSave).subscribe(club => {
      const savedClub = this.clubs.find(club => club.club_id === clubId);
      Object.assign(savedClub, club);
      this.editClubCache[clubId].edit = false;
      this.editClubCache[clubId].data = savedClub;
    });
  }
  
  startMemberEdit(id: string): void {
    this.editMemberCache[id].edit = true;
  }

  cancelMemberEdit(memberId: string, clubId: string): void {
    const club = this.clubs.find(item => item.club_id === clubId);
    if(club){
      const member = club.club_members.find(member => member.member_id === memberId);
      this.editMemberCache[memberId] = {
        data: { ...member },
        edit: false
      };
    }
  }

  saveMemberEdit(memberId: string, clubId: string): void {
    const memberToSave = this.editMemberCache[memberId].data;
    this.memberService.save(memberToSave, clubId).subscribe(member => {
      const club = this.clubs.find(item => item.club_id === clubId);
      const memberToUpdate = club.club_members.find(m => m.member_id ==  member.member_id);
      Object.assign(memberToUpdate, member);
      this.editMemberCache[memberId].edit = false;
      this.editMemberCache[memberId].data = member;
    });
  }

  updateEditCache(): void {
    this.clubs.forEach(club => {
      this.editClubCache[club.club_id] = {edit: false, data: {...club}};
      club.club_members.forEach(member => {
        this.editMemberCache[member.member_id] = {
          edit: false,
          data: { ...member }
        };
      });
      
    });
  }

  deleteMember(memberId: string, clubId: string){
    this.memberService.delete(memberId, clubId).subscribe(result => {
      const club = this.clubs.find(club => club.club_id === clubId);
      club.club_members = club.club_members.filter(member => member.member_id !== memberId );
    });
  }

  constructor(private clubService: ClubService, private memberService: MemberService, private loggerService: LoggerService){}
  ngOnInit(): void {

    this.clubService.getAll().subscribe(data => {
      this.clubs =  data.list.clubs || [];
      this.clubs.forEach(club => club.expand = false);
      this.updateEditCache();
    });

    
  }
}
