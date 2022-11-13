import { Injectable, Renderer2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ScriptService {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  public loadScript(renderer: Renderer2, src: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let script = <HTMLScriptElement>(
        this.document.querySelector(`script[src="${src}"]`)
      );
      if (script) {
        console.log(script);
        // script.remove();
        return resolve(true);
      }
      script = renderer.createElement('script');
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        reject('Error while loading the script');
      };
      script.type = 'text/javascript';
      script.src = src;
      renderer.appendChild(this.document.body, script);
    });
  }
}
