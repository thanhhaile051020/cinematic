import { Request, Response } from 'express';
import { Controller, handleError, queryParam } from 'express-ext';
import { Attributes, Log, Search } from 'onecore';
import { buildMap, buildToDelete, buildToInsert, buildToInsertBatch, buildToUpdate, DB, SearchBuilder, SearchResult, select, Service, Statement } from 'query-core';
import { TemplateMap, useQuery } from 'query-mappers';
import { Theaterclustersystem, TheaterclustersystemFilter, TheaterclustersystemModel, TheaterclustersystemService } from './theatersystem';

export * from './theatersystem';

export function useTheaterclustersystemService(db: DB, mapper?: TemplateMap): TheaterclustersystemService {
  const query = useQuery('Theaterclustersystem', mapper, TheaterclustersystemModel, true);
  const builder = new SearchBuilder<Theaterclustersystem, TheaterclustersystemFilter>(db.query, 'Theaterclustersystems', TheaterclustersystemModel, db.driver, query);
  return new SqlTheaterclustersystemService(builder.search, db);
}
export function useTheaterclustersystemController(log: Log, db: DB, mapper?: TemplateMap): TheaterclustersystemController {
  return new TheaterclustersystemController(log, useTheaterclustersystemService(db, mapper));
}

export class TheaterclustersystemController extends Controller<Theaterclustersystem, string, TheaterclustersystemFilter> {
  constructor(log: Log, private TheaterclustersystemService: TheaterclustersystemService) {
    super(log, TheaterclustersystemService);
    this.array = ['status'];
    this.all = this.all.bind(this);
    this.getTheaterclustersystemsOfRole = this.getTheaterclustersystemsOfRole.bind(this);
  }
  all(req: Request, res: Response) {
    const v = req.query['roleId'];
    if (this.TheaterclustersystemService.all) {
      this.TheaterclustersystemService.all()
        .then(Theaterclustersystems => res.status(200).json(Theaterclustersystems))
        .catch(err => handleError(err, res, this.log));
    } else {
      res.status(400).end('roleId is required');
    }

  }
  getTheaterclustersystemsOfRole(req: Request, res: Response) {
    const id = queryParam(req, res, 'roleId');
    if (id) {
      this.TheaterclustersystemService.getTheaterclustersystemsOfRole(id)
        .then(Theaterclustersystems => res.status(200).json(Theaterclustersystems))
        .catch(err => handleError(err, res, this.log));
    }
  }
}

const TheaterclustersystemRoleModel: Attributes = {
  TheaterclustersystemId: {
    key: true
  },
  roleId: {
    key: true
  },
};
interface TheaterclustersystemRole {
  TheaterclustersystemId?: string;
  roleId: string;
}
export class SqlTheaterclustersystemService extends Service<Theaterclustersystem, string, TheaterclustersystemFilter> implements TheaterclustersystemService {
  constructor(
    protected find: Search<Theaterclustersystem, TheaterclustersystemFilter>,
    db: DB
  ) {
    super(find, db, 'Theaterclustersystems', TheaterclustersystemModel);
    this.search = this.search.bind(this);
    this.all = this.all.bind(this);
    this.insert = this.insert.bind(this);
    this.update = this.update.bind(this);
    this.patch = this.patch.bind(this);
    this.delete = this.delete.bind(this);
    this.map = buildMap(TheaterclustersystemModel);
  }
  getTheaterclustersystemsOfRole(roleId: string): Promise<Theaterclustersystem[]> {
    if (!roleId || roleId.length === 0) {
      return Promise.resolve([]);
    }
    const q = `
      select u.*
      from TheaterclustersystemRoles ur
        inner join Theaterclustersystems u on u.TheaterclustersystemId = ur.TheaterclustersystemId
      where ur.roleId = ${this.param(1)}
      order by TheaterclustersystemId`;
    return this.query(q, [roleId], this.map);
  }
  search(s: TheaterclustersystemFilter, limit?: number, offset?: number | string, fields?: string[]): Promise<SearchResult<Theaterclustersystem>> {
    return this.find(s, limit, offset, fields);
  }
  all(): Promise<Theaterclustersystem[]> {
    console.log("here")
    return this.query('select * from Theaterclustersystems order by TheaterclustersystemId asc', undefined, this.map);
  }
  load(id: string): Promise<Theaterclustersystem | null> {
    const stmt = select(id, 'Theaterclustersystems', this.primaryKeys, this.param);
    if (!stmt) {
      return Promise.resolve(null);
    }
    return this.query<Theaterclustersystem>(stmt.query, stmt.params, this.map)
      .then(Theaterclustersystems => {
        if (!Theaterclustersystems || Theaterclustersystems.length === 0) {
          return null;
        }
        const Theaterclustersystem = Theaterclustersystems[0];
        const q = `select roleId from TheaterclustersystemRoles where TheaterclustersystemId = ${this.param(1)}`;
        return this.query<TheaterclustersystemRole>(q, [Theaterclustersystem.theaterclustersystemid]).then(roles => {
          // if (roles && roles.length > 0) {
          //   Theaterclustersystem.roles = roles.map(i => i.roleId);
          // }
          return Theaterclustersystem;
        });
      });
  }
  insert(Theaterclustersystem: Theaterclustersystem): Promise<number> {
    const stmts: Statement[] = [];
    const stmt = buildToInsert(Theaterclustersystem, 'Theaterclustersystems', TheaterclustersystemModel, this.param);
    if (!stmt) {
      return Promise.resolve(-1);
    }
    stmts.push(stmt);
    return this.execBatch(stmts);
  }
  update(Theaterclustersystem: Theaterclustersystem): Promise<number> {
    const stmts: Statement[] = [];
    const stmt = buildToUpdate(Theaterclustersystem, 'Theaterclustersystems', TheaterclustersystemModel, this.param);
    if (!stmt) {
      return Promise.resolve(-1);
    }
    const query = `delete from TheaterclustersystemRoles where theaterclustersystemid = ${this.param(1)}`;
    stmts.push({ query, params: [Theaterclustersystem.theaterclustersystemid] });
    return this.exec(stmt.query, stmt.params);
  }
  patch(Theaterclustersystem: Theaterclustersystem): Promise<number> {
    return this.update(Theaterclustersystem);
  }
  delete(id: string): Promise<number> {
    const stmts: Statement[] = [];
    const query = `delete from TheaterclustersystemRoles where TheaterclustersystemId = ${this.param(1)}`;
    stmts.push({ query, params: [id] });
    const stmt = buildToDelete(id, 'Theaterclustersystems', this.primaryKeys, this.param);
    if (!stmt) {
      return Promise.resolve(-1);
    }
    stmts.push(stmt);
    return this.execBatch(stmts);
  }
}

