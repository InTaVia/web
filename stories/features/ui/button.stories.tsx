import type { Meta, StoryObj } from '@storybook/react';

import Button from '@/features/ui/Button';

const meta: Meta = {
  title: 'UI Elements/Button',
  component: Button,
};

export default meta;

export const Default: StoryObj = {
  args: {
    children: 'Click me',
  },
};

export const Pill: StoryObj = {
  args: {
    ...Default.args,
    round: 'pill',
  },
};

export const PrimaryColor: StoryObj = {
  args: {
    ...Default.args,
    color: 'primary',
  },
};

export const PrimaryColorDisabled: StoryObj = {
  args: {
    ...PrimaryColor.args,
    disabled: true,
  },
};
