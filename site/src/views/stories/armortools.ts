import { mountKit } from "./kit";

/** The page is bento rows of screens and recordings; reveals and video playback are shared, so only the kit mounts */
export function mount(root: HTMLElement) {
  return mountKit(root);
}
