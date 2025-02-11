import { mount } from '@vue/test-utils';
import { expect, it } from "vitest";
import App from "../App.vue";

it("toUpperCase", () => {
  const result = mount(App);
  expect(result.html()).toMatchSnapshot();
});
