import { IOptionalCallback } from "@/data"

export class Completable {
  constructor(public onCompleted?: IOptionalCallback<boolean>) { }
  private _completed: boolean = false
  public get completed(): boolean {
    return this._completed
  }

  protected set completed(v: boolean) {
    this._completed = v
  }
}
