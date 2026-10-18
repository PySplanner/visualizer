// types/settings.ts
export type FieldImage = 'bioglow-founders-wireframe';

export interface UserSettings {
  fieldImage: FieldImage;
  fieldWidthInches: number;
  fieldLengthInches: number;
}

export const DEFAULT_SETTINGS: UserSettings = {
  fieldImage: 'bioglow-founders-wireframe',
  fieldWidthInches: 45,
  fieldLengthInches: 93,
};

export const SETTINGS_COOKIE_NAME = 'pysplanner-user-settings';