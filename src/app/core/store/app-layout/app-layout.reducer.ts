import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { AppLayoutActionTypes, AppLayoutAction } from './app-layout.actions';
import { Themes, DEFAULT_THEME } from '../../../app.themes';

export interface IAppVersion {
  semver: string;
  isNewAvailable: boolean;
  checkingForVersion: boolean;
}
export interface IAppSettings {
  sidebarExpanded: boolean;
  requestInProcess: boolean;
  version: IAppVersion;
  theme: string;
  themes: string[];
}
const initialState: IAppSettings = {
  sidebarExpanded: true,
  requestInProcess: false,
  version: {
    semver: '',
    isNewAvailable: false,
    checkingForVersion: false
  },
  theme: DEFAULT_THEME,
  themes: Themes.sort()
};

export function appLayout(
  state: IAppSettings = initialState,
  action: AppLayoutAction
): IAppSettings {
  switch (action.type) {
    case AppLayoutActionTypes.SIDEBAR_EXPAND:
      return { ...state, sidebarExpanded: true };

    case AppLayoutActionTypes.SIDEBAR_COLLAPSE:
      return { ...state, sidebarExpanded: false };

    case AppLayoutActionTypes.SIDEBAR_TOGGLE:
      return { ...state, sidebarExpanded: !state.sidebarExpanded };

    case AppLayoutActionTypes.APP_VERSION_RECEIVED: {
      const version = getVersion(state, action.payload);
      return { ...state, version };
    }

    case AppLayoutActionTypes.APP_CHECK_VERSION: {
      const version = {
        ...state.version,
        checkingForVersion: true
      };
      return { ...state, version };
    }

    case AppLayoutActionTypes.APP_THEME_CHANGE: {
      return { ...state, theme: action.payload };
    }

    default:
      return { ...initialState, ...state, themes: Themes.sort() };
  }
}

export function getSidebarExpanded($state: Store<IAppSettings>) {
  return $state.select(state => state.sidebarExpanded);
}

function getVersion(state: IAppSettings, packageJson: any): IAppVersion {
  const currentVersion = state.version.semver;
  const remoteVersion = packageJson.version;
  const version: IAppVersion = {
    semver: '',
    isNewAvailable: state.version.isNewAvailable,
    checkingForVersion: false
  };
  const isCurrentVersionEmpty = '' === currentVersion;
  const isCurrentDifferentFromRemote =
    !isCurrentVersionEmpty && currentVersion !== remoteVersion;
  if (isCurrentVersionEmpty) {
    version.semver = remoteVersion;
  }
  if (isCurrentDifferentFromRemote && !version.isNewAvailable) {
    version.semver = currentVersion;
    version.isNewAvailable = true;
  } else {
    // upgrade is completed
    version.semver = remoteVersion;
    version.isNewAvailable = false;
  }
  return version;
}
