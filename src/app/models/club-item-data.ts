import { MemberItemData } from "./member-item-data";

export interface ClubItemData {
    club_id: string;
    club_name: string;
    club_address: string;
    club_members: MemberItemData[];
    expand?: boolean
  }
