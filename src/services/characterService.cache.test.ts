import { beforeEach, describe, expect, it, vi } from "vitest";

import { api } from "../api/api";

vi.mock("../api/api", () => ({ api: { get: vi.fn() } }));

const loadService = async () => {
  vi.resetModules();
  return (await import("./characterService")).characterService;
};

const respond = () => {
  vi.mocked(api.get).mockImplementation((url: string) => {
    if (url.includes("versions.json")) return Promise.resolve(["16.17.1"] as never);
    return Promise.resolve({ data: { Aatrox: { id: "Aatrox" } } } as never);
  });
};

describe("characterService caching", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    respond();
  });

  it("requests the champion list only once", async () => {
    const service = await loadService();

    await Promise.all([service.getAll(), service.getAll()]);
    await service.getAll();

    const listCalls = vi
      .mocked(api.get)
      .mock.calls.filter(([url]) => (url as string).includes("champion.json"));
    expect(listCalls).toHaveLength(1);
  });

  it("requests the patch only once across different calls", async () => {
    const service = await loadService();

    await service.getAll();
    await service.getVersion();

    const versionCalls = vi
      .mocked(api.get)
      .mock.calls.filter(([url]) => (url as string).includes("versions.json"));
    expect(versionCalls).toHaveLength(1);
  });

  it("retries after a failure instead of caching it", async () => {
    const service = await loadService();
    vi.mocked(api.get).mockRejectedValueOnce(new Error("offline"));

    await expect(service.getAll()).rejects.toThrow("offline");
    respond();

    await expect(service.getAll()).resolves.toHaveLength(1);
  });
});
