import { AngularclientPage } from './app.po';

describe('angularclient App', () => {
  let page: AngularclientPage;

  beforeEach(() => {
    page = new AngularclientPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
