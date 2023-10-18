import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError } from "./errors";

export interface LabelDoc extends BaseDoc {
  owner: ObjectId;
  label: string;
}

export interface LabeledItemDoc extends LabelDoc {
  item: string;
}

export default class LabelConcept {
  public readonly labels = new DocCollection<LabelDoc>("labels");
  public readonly labeledItems = new DocCollection<LabeledItemDoc>("itemLabels");

  async createLabel(owner: ObjectId, label: string) {
    const query = { owner, label };
    if (!(await this.labels.readOne(query))) {
      await this.labels.createOne(query);
      return { msg: `Successfuly created new '${label}'!` };
    } else {
      return { msg: "Label already exists!" };
    }
  }

  async deleteLabel(owner: ObjectId, label: string) {
    const query = { owner, label };
    await this.labels.deleteOne(query);
    await this.labeledItems.deleteMany(query);
    return { msg: `Successfuly deleted label '${label}'` };
  }

  async labelItem(owner: ObjectId, label: string, item: string) {
    const query = { owner, label, item };
    if (await this.labeledItems.readOne(query)) {
      throw new NotAllowedError(`This item is already labeled as '${label}'!`);
    }
    await this.labeledItems.createOne(query);
    return { msg: `Successfuly labeled an item as '${label}'!` };
  }

  async removeItemLabel(owner: ObjectId, label: string, item: string) {
    await this.labeledItems.deleteOne({ owner, label, item });
    return { msg: `Successfuly removed label '${label}' from an item!` };
  }

  async getLabels(owner: ObjectId) {
    return (await this.labels.readMany({ owner })).map((labelDoc) => labelDoc.label);
  }

  async updateLabel(owner: ObjectId, oldLabel: string, newLabel: string) {
    const updateLabel: Partial<LabelDoc> = { owner, label: newLabel };
    await this.labels.updateOne({ owner, label: oldLabel }, updateLabel);
    await this.labeledItems.updateMany({ owner, label: oldLabel }, updateLabel);
    return { msg: `Successfully changed all instances of '${oldLabel}' to ${newLabel}` };
  }

  async getLabeledItems(owner: ObjectId, label?: string) {
    const query = label ? { owner, label } : { owner };
    return await this.labels.readMany(query);
  }

  async getItemLabels(owner: ObjectId, item: string) {
    const labeledItems = await this.labeledItems.readMany({ owner, item });
    return labeledItems.map((doc) => doc.label);
  }

  async getAllItemLabels(owner: ObjectId) {
    const labeledItems = await this.labeledItems.readMany({ owner });
    const itemMap: Array<[string, string]> = labeledItems.map((doc) => [doc.item, doc.label]);
    return new Map(itemMap);
  }
}
