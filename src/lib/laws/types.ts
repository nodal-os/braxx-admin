export interface LawState {
  code: string;
  name: string;
  region: string;
  featured: boolean;
  roads: string;
  need: string;
  helmet: string;
  notes: string;
  ohv: string;
  takeaway: string;
  seller: string | null;
  ship_flag: boolean;
}

export interface LawsCatalog {
  last_verified: string;
  contact: string;
  states: LawState[];
}
