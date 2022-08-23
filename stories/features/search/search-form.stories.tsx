import type { Meta, StoryObj } from '@storybook/react';

import { SearchForm } from '@/features/entities/search-form';

const meta: Meta = {
  title: 'Components/Search/SearchForm',
  component: SearchForm,
};

export default meta;

export const Default: StoryObj = {
  args: {},
};
