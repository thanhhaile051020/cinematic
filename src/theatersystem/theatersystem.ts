import { Attributes, Filter, Service } from 'onecore';

export interface TheaterclustersystemFilter extends Filter {
  theaterclustersystemid?: string;
  theaterclustersystemName?: string;
  aliases?: string;
  status?: Date;
  createdby?: string;
  createdat?: Date;
  updatedby?: string;
  updatedat?: Date;
}
export interface Theaterclustersystem {
  theaterclustersystemid: string;
  theaterclustersystemName: string;
  logo?: string;
  aliases?: string;
  status?: Date;
  createdby?: string;
  createdat?: Date;
  updatedby?: string;
  updatedat?: Date;
}
export interface TheaterclustersystemService extends Service<Theaterclustersystem, string, TheaterclustersystemFilter> {
  getTheaterclustersystemsOfRole(roleId: string): Promise<Theaterclustersystem[]>;
}

export const TheaterclustersystemModel: Attributes = {
  theaterclustersystemId: {
    key: true,
    match: 'equal',
    length: 40
  },
  theaterclustersystemName: {
    required: true,
    length: 255,
    q: true,
    match: 'prefix'
  },
  aliases: {
    required: true,
    length: 120,
    q: true
  },
  status: {
    match: 'equal',
    length: 1
  },
  logo: {
    length: 255
  },

  createdBy: {},
  createdAt: {
    type: 'datetime'
  },
  updatedBy: {},
  updatedAt: {
    type: 'datetime'
  }
};
