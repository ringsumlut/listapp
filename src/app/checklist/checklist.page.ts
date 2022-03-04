import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertController, IonList } from '@ionic/angular';
import { Subscriber, Subscription } from 'rxjs';
import { Checklist } from '../interfaces/checklist';
import { ChecklistService } from '../services/checklist.service';
import { CheckListItem } from '../interfaces/checklist-item';

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit {
  @ViewChild(IonList, { static: false }) slidingList: IonList;

  private checklistSubscription: Subscription;

  public checklist: Checklist = {
    id: '',
    title: '',
    items: [],
  };

  constructor(
    private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private checklistService: ChecklistService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('id', id);
    this.checklistSubscription = this.checklistService
      .getChecklist(id)
      .subscribe((checklist) => {
        this.checklist = checklist;
      });
  }

  ngOnDestroy() {
    if (this.checklistSubscription !== null) {
      this.checklistSubscription.unsubscribe();
    }
  }

  async addItem(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Add Item',
      message: 'Enter the name of your item',
      inputs: [
        {
          type: 'text',
          name: 'name',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: async (data) => {
            await this.checklistService.addItemToChecklist(
              this.checklist.id,
              data.name
            );
            this.slidingList.closeSlidingItems();
          },
        },
      ],
    });
    alert.present();
  }

  async renameItem(item: CheckListItem): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Rename Item',
      message: 'Enter the new name of your item',
      inputs: [
        {
          type: 'text',
          name: 'name',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Save',
          handler: async (data) => {
            await this.checklistService.updateItemInChecklist(
              this.checklist.id,
              item.id,
              data.name
            );
            this.slidingList.closeSlidingItems();
          },
        },
      ],
    });
    alert.present();
  }

  async removeItem(item: CheckListItem): Promise<void> {
    this.slidingList.closeSlidingItems();
    this.checklistService.removeItemInChecklist(this.checklist.id, item.id);
  }

  toggleItem(item: CheckListItem): void {
    this.checklistService.setItemStatus(
      this.checklist.id,
      item.id,
      !item.checked
    );
  }

  restartList(): void {
    this.checklistService.resetItemStatusForChecklist(this.checklist.id);
  }
}
