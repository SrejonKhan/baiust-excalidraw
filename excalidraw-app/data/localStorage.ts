import { ExcalidrawElement } from "../../src/element/types";
import { AppState } from "../../src/types";
import {
  clearAppStateForLocalStorage,
  getDefaultAppState,
} from "../../src/appState";
import { clearElementsForLocalStorage } from "../../src/element";
import { STORAGE_KEYS } from "../app_constants";
import { ImportedDataState } from "../../src/data/types";
import { predefinedLibrary } from "./predefinedLibrary";

export const saveUsernameToLocalStorage = (username: string) => {
  try {
    localStorage.setItem(
      STORAGE_KEYS.LOCAL_STORAGE_COLLAB,
      JSON.stringify({ username }),
    );
  } catch (error: any) {
    // Unable to access window.localStorage
    console.error(error);
  }
};

export const importUsernameFromLocalStorage = (): string | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_COLLAB);
    if (data) {
      return JSON.parse(data).username;
    }
  } catch (error: any) {
    // Unable to access localStorage
    console.error(error);
  }

  return null;
};

export const importFromLocalStorage = () => {
  let savedElements = null;
  let savedState = null;

  try {
    savedElements = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS);
    savedState = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_APP_STATE);
  } catch (error: any) {
    // Unable to access localStorage
    console.error(error);
  }

  let elements: ExcalidrawElement[] = [];
  if (savedElements) {
    try {
      elements = clearElementsForLocalStorage(JSON.parse(savedElements));
    } catch (error: any) {
      console.error(error);
      // Do nothing because elements array is already empty
    }
  }

  let appState = null;
  if (savedState) {
    try {
      appState = {
        ...getDefaultAppState(),
        ...clearAppStateForLocalStorage(
          JSON.parse(savedState) as Partial<AppState>,
        ),
      };
    } catch (error: any) {
      console.error(error);
      // Do nothing because appState is already null
    }
  }
  return { elements, appState };
};

export const getElementsStorageSize = () => {
  try {
    const elements = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS);
    const elementsSize = elements?.length || 0;
    return elementsSize;
  } catch (error: any) {
    console.error(error);
    return 0;
  }
};

export const getTotalStorageSize = () => {
  try {
    const appState = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_APP_STATE);
    const collab = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_COLLAB);
    const library = localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_LIBRARY);

    const appStateSize = appState?.length || 0;
    const collabSize = collab?.length || 0;
    const librarySize = library?.length || 0;

    return appStateSize + collabSize + librarySize + getElementsStorageSize();
  } catch (error: any) {
    console.error(error);
    return 0;
  }
};

export const getLibraryItemsFromStorage = () => {
  try {
    const predefinedLibLoadState = Boolean(
      localStorage.getItem(STORAGE_KEYS.PREDEFINED_LIB_LOAD_STATE) as string,
    );

    let userLibraryItems =
      JSON.parse(
        localStorage.getItem(STORAGE_KEYS.LOCAL_STORAGE_LIBRARY) as string,
      ) ?? [];

    // even if user already added other libraries from excalidraw, we would merge the
    // predefined library (DSA and Digital Logic).
    if (!predefinedLibLoadState) {
      const predefinedLibraryItems = JSON.parse(predefinedLibrary as string);
      userLibraryItems = [...userLibraryItems, ...predefinedLibraryItems];
      localStorage.setItem(STORAGE_KEYS.PREDEFINED_LIB_LOAD_STATE, "true");
    }

    return userLibraryItems || [];
  } catch (error) {
    console.error(error);
    return [];
  }
};
