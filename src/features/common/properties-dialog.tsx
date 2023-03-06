import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

import {
  Button,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@intavia/ui';
import { useState } from 'react';

import type { ComponentProperty } from '@/features/common/component-property';
import type { Visualization } from '@/features/common/visualization.slice';
import type { Story } from '@/features/storycreator/storycreator.slice';

interface PropertiesDialogProps {
  element: Story | Visualization;
  onClose: () => void;
  onSave: ((element: Story) => void) | ((element: Visualization) => void);
}

export function PropertiesDialog(props: PropertiesDialogProps): JSX.Element {
  const { element, onClose, onSave } = props;

  const [tmpProperties, setTmpProperties] = useState({ ...element.properties });
  const [tmpElement, setTmpElement] = useState({
    ...element,
    visibilities: element.visibilities !== undefined ? element.visibilities : {},
  });

  const onChange = (event: any) => {
    const newVal = { ...tmpProperties[event.target.id], value: event.target.value };
    setTmpProperties({ ...tmpProperties, [event.target.id]: newVal });
  };

  let editableAttributes = [];

  editableAttributes = Object.values(tmpProperties as object)
    .filter((prop: ComponentProperty) => {
      return prop.editable;
    })
    .sort((a: ComponentProperty, b: ComponentProperty) => {
      return (a.sort !== undefined ? a.sort : 0) - (b.sort !== undefined ? b.sort : 0);
    });

  let name = tmpElement.id;
  if (tmpElement.properties !== undefined) {
    if (
      tmpElement.properties.name !== undefined &&
      tmpElement.properties.name.value !== '' &&
      tmpElement.properties.name.value !== undefined
    ) {
      name = tmpElement.properties.name.value;
    }
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit {name}</DialogTitle>
      </DialogHeader>

      <div>
        <div key={'gridTest'} className="grid h-auto w-auto grid-cols-[auto,auto] gap-4">
          {editableAttributes.map((property: ComponentProperty) => {
            switch (property.type) {
              case 'boolean':
                return [
                  <div key={`${property.id}Label`}>{property.label}</div>,
                  <Switch
                    key={`${property.id}Switch`}
                    checked={property.value}
                    onCheckedChange={() => {
                      const newProps = {
                        ...tmpProperties,
                      };

                      const oldValue = newProps[property.id]!.value as boolean;

                      newProps[property.id] = { ...property, value: !oldValue };
                      setTmpProperties(newProps);
                    }}
                  />,
                ];

              case 'number':
                return [
                  <div key={`${property.id}Label`}>{property.label}</div>,
                  <Input
                    inputMode="numeric"
                    pattern="[0-9]*"
                    key={`${property.id}Number`}
                    value={property.value}
                    onChange={(val: any) => {
                      const newProps = {
                        ...tmpProperties,
                      };

                      newProps[property.id] = { ...property, value: val };
                      setTmpProperties(newProps);
                    }}
                  />,
                ];

              case 'text':
                return [
                  <div key={`${property.id}Label`}>{property.label}</div>,
                  <Input
                    key={`${property.id}Input`}
                    id={property.id}
                    onChange={onChange}
                    value={property.value}
                  />,
                ];

              case 'select':
                return [
                  <div key={`${property.id}Label`}>{property.label}</div>,
                  <Select
                    key={`${property.id}Select`}
                    value={property.value}
                    onValueChange={(val: any) => {
                      const newProps = {
                        ...tmpProperties,
                      };

                      newProps[property.id] = { ...property, value: val };
                      setTmpProperties(newProps);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        <span className="block truncate">{property.value.name}</span>
                      </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                      {property.options?.map((option, optionIdx) => {
                        return (
                          <SelectItem key={`option${optionIdx}`} value={option}>
                            {option.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>,
                ];
            }
          })}
        </div>
      </div>

      <DialogFooter>
        <Button onClick={onClose} variant="outline">
          Cancel
        </Button>

        <Button
          onClick={() => {
            const newElement = { ...tmpElement, properties: tmpProperties };
            onSave(newElement);
            onClose();
          }}
        >
          Save
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
