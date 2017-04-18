import { AmneProjectPage } from './app.po';

describe('amne-project App', function() {
  let page: AmneProjectPage;

  beforeEach(() => {
    page = new AmneProjectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
