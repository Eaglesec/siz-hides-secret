import { Component, ViewChild } from '@angular/core';
import { SnackbarComponent } from 'app/shared/components/snackbar/snackbar.component';
import {
  getDecodedMessage,
  getBase64ImageFromBlob,
  copyText,
} from 'app/shared/utils';

@Component({
  selector: 'app-unlock',
  templateUrl: './unlock.component.html',
  styleUrls: ['./unlock.component.scss'],
})
export class UnlockComponent {
  previewImageSource = '';
  decodedMessage = '';
  isOutputVisible = false;

  @ViewChild(SnackbarComponent)
  snackbar!: SnackbarComponent;

  constructor() {}

  handlePreview(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files as FileList;
    const imageFile = files[0];

    getBase64ImageFromBlob(imageFile)
      .then((src) => {
        this.previewImageSource = src;
      })
      .catch((err) => {
        this.snackbar.show(err.message);
      });
  }

  handleSubmit(event: Event) {
    event.preventDefault();

    const target = event.target as HTMLFormElement;
    const password = target.password.value as string;

    getDecodedMessage(this.previewImageSource, password)
      .then((msg) => {
        this.decodedMessage = msg;
        this.isOutputVisible = true;
      })
      .catch((err) => {
        this.snackbar.show(err.message);
      });
  }

  handleCopy() {
    copyText(this.decodedMessage)
      .then(() => {
        this.snackbar.show('Copied to clipboard');
      })
      .catch((err) => {
        this.snackbar.show(err.message);
      });
  }
}
