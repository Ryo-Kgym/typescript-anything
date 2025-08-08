import { describe, expect, it } from "vitest";
import { SampleStatus } from "./sample-status";

describe("SampleStatus", () => {
  it.each`
    sample              | name
    ${SampleStatus.ONE} | ${"ONE"}
    ${SampleStatus.TWO} | ${"TWO"}
  `("$sample => $name", ({ sample, name }) => {
    const actual = sample;
    expect(actual.name).toEqual(name);
  });
});
