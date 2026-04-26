import { ComponentHarness } from '@angular/cdk/testing';

export class TabsHarness extends ComponentHarness {
  // debe coincidir co selector do compoñente que se quere probar
  static hostSelector = 'tabs';

  // localizador para os botones das tabs, que son os elementos interactivos do compoñente.
  private getButtons = this.locatorForAll('button.tab-link');

  async getTabLabel(): Promise<string[]> {
    const buttons = await this.getButtons();
    // mapéase cada botón para obter o seu texto, devolve unha promesa con un array de strings
    // Promise.all é necesario porque cada chamada a button.text() devolve unha promesa,
    // e queremos esperar a que se resolvan todas antes de devolver o resultado final.
    return Promise.all(buttons.map((button) => button.text()));
  }

  async getActiveLabel(): Promise<string | null> {
    const buttons = await this.getButtons();
    for (const button of buttons) {
      if (await button.hasClass('active')) {
        return button.text();
      }
    }
    return null;
  }

  async clickTabByIndex(index: number) {
    const buttons = await this.getButtons();
    if (index < 0 || index >= buttons.length) {
      throw new Error(`Index ${index} is out of bounds for tabs`);
    }
    await buttons[index].click();
  }
}
