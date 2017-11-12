import { NgTestTaskChartsPage } from './app.po';

describe('ng-test-task-charts App', () => {
  let page: NgTestTaskChartsPage;

  beforeEach(() => {
    page = new NgTestTaskChartsPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
