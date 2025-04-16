import { atomWithStorage } from "jotai/utils";



export const uiAtom = atomWithStorage('ui', {
  isSidebarOpen: false,
  theme: 'light',
});
