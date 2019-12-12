import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

@Component({
  selector: 'app-toolbar-twee',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarTweeComponent implements OnInit {
  // The event that will be sent to the map component
  @Output() event = new EventEmitter();

  // The currently selected tool
  private _selectedTool = 'open_with';

  // All the buttons stored in an array.
  private _buttons: Array<{ icon: string, tooltip: string, tool?: boolean, event?: string}> = [
    { icon: 'open_with', tooltip: 'Klik en sleep om de kaart te verplaatsen', tool: true },
    { icon: 'photo_size_select_small', tooltip: 'Selecteer meerdere objecten', tool: true },
    { icon: 'create', tooltip: 'Tekenen', tool: true },
    { icon: 'straighten', tooltip: 'Opmeten', tool: true },
    { icon: 'map', tooltip: 'Kies de achtergrond kaart' },
    { icon: 'layers', tooltip: 'Zet lagen aan of uit' },
    { icon: 'layers_clear', tooltip: 'Zet alle lagen uit' },
    { icon: 'color_lens', tooltip: 'Teken kleur' },
    { icon: 'undo', tooltip: 'Undo' },
    { icon: 'redo', tooltip: 'Redo' },
    { icon: 'save', tooltip: 'Save' },
    { icon: 'zoom_in', tooltip: 'Zoom in', event: 'zoom-in' },
    { icon: 'zoom_out', tooltip: 'Zoom uit', event: 'zoom-out' }
  ];

  constructor() { }

  ngOnInit() {
  }

  // Method to change the currently selected tool and send an event to the map component
  sendEvent(button: { icon: string, tooltip: string, tool?: boolean, event?: string }) {
    if (button.tool) {
      this._selectedTool = button.icon;
    }
    console.log(button);
    this.event.emit(button.icon);
  }

  get selectedTool() {
    return this._selectedTool;
  }

  get buttons() {
    return this._buttons;
  }

}
