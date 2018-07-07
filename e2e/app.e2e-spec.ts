import { EkitchenPage } from './app.po';

describe('ekitchen App', () => {
  let page: EkitchenPage;

  beforeEach(() => {
    page = new EkitchenPage();
  });

  it('should display welcome message', done => {
    page.navigateTo();
    page.getParagraphText()
      .then(msg => expect(msg).toEqual('Welcome to app!!'))
      .then(done, done.fail);
  });
});
