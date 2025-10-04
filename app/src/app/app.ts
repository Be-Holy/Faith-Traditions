import { Component, computed, signal } from '@angular/core';

interface FaithEntry {
  id: string;
  'display-name': string;
}

interface Faith {
  id: string;
  name: string;
  icon: string;
  link: string;
  aliases?: string[];
  texts?: string[];
  description?: string;
}

interface TextEntry {
  id: string;
  'display-name': string;
}

interface Text {
  id: string;
  name: string;
  links: Record<string, string>;
}

@Component({
  selector: 'app-root',
  imports: [],
  template: `
    @if (faiths(); as faiths) {
    <h1>Faith Traditions</h1>
    <ul>
      @for(faith of faiths; track faith.id) {
      <span [class.selected]="selectedFaithId() === faith.id" (click)="selectFaith(faith.id)">
        {{ faith['display-name'] }}
      </span>
      } @empty {
      <p>We couldn't find any information about faiths</p>
      }
    </ul>
    } @if (selectedFaith(); as faith) {
    <h2>
      <img [src]="faith.icon" class="faith-icon" [alt]="faith.name" />
      <span>{{ faith.name }}</span>
    </h2>
    @if (faith.aliases?.length) {
    <div class="aliases">also known as {{ faith.aliases?.join(', ') }}</div>
    }
    <div class="description">{{faith.description}}</div>
    <dl>
      <dt>Sacred Texts</dt>
      <dd>{{selectedFaithTexts() || '(no sacred texts)'}}</dd>
    </dl>
    }
  `,
  styles: `
    .selected {
      font-weight: bold;
    }
    ul {
      display: flex;
      flex-wrap: wrap;
    }
    .faith-icon {
      max-width: 50px;
      max-height: 50px;
    }
    h2 {
      display: flex;
      align-items: center;
      gap: .5rem;
    }
  `,
})
export class App {
  readonly faiths = signal<Array<FaithEntry> | null | undefined>(undefined);
  readonly texts = signal<Array<TextEntry> | null | undefined>(undefined);
  readonly selectedFaithId = signal<string | null>(null);
  readonly selectedFaith = signal<Faith | null>(null);
  readonly selectedFaithTexts = computed(() => {
    const selectedFaith = this.selectedFaith();
    const texts = this.texts();

    if (!selectedFaith?.texts || !texts) {
      return '';
    }

    return selectedFaith.texts.map(tid => texts.find(t => t.id === tid)?.['display-name']).join(', ');
  });

  async ngOnInit() {
    const [faiths, texts] = await Promise.all([
      (await (await fetch('faiths.json')).json()).faiths,
      (await (await fetch('texts.json')).json()).texts,
    ]);
    this.faiths.set(faiths);
    this.texts.set(texts);
  }

  async selectFaith(faithId: string) {
    this.selectedFaithId.set(faithId);
    if (faithId) {
      const faith = await (await fetch(`${faithId}.json`)).json();
      this.selectedFaith.set(faith);
    } else {
      this.selectedFaith.set(null);
    }
  }
}
