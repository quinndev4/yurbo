import * as React from 'react';
import { useState } from 'react';
import { useControl } from 'react-map-gl/maplibre';
import { createPortal } from 'react-dom';
import type {
  ControlPosition,
  IControl,
  MapInstance,
} from 'react-map-gl/maplibre';

type Icon = React.ForwardRefExoticComponent<
  Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
    title?: string;
    titleId?: string;
  } & React.RefAttributes<SVGSVGElement>
>;

class CustomControlClass implements IControl {
  _map: MapInstance | null = null;
  _container: HTMLElement | null = null;
  _redraw: () => void;

  constructor(redraw: () => void) {
    this._redraw = redraw;
  }

  onAdd(map: MapInstance) {
    this._map = map;
    map.on('move', this._redraw);

    /* global document */
    this._container = document.createElement('div');
    this._redraw();

    return this._container;
  }

  onRemove() {
    this._container?.remove();
    this._map?.off('move', this._redraw);
    this._map = null;
  }

  getMap() {
    return this._map;
  }

  getElement() {
    return this._container;
  }
}

function CustomControlComponent({
  title,
  icon: IconComponent,
  onClick,
  selected = false,
  first = false,
  last = false,
}: {
  title: string;
  icon: Icon;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  selected?: boolean;
  first?: boolean;
  last?: boolean;
}) {
  return (
    <button
      className={`h-[29px] w-[29px] ${selected ? '!bg-gray-400 text-white' : ''} ${last ? 'rounded-b-sm' : ''} ${first ? 'rounded-t-sm' : ''}`}
      title={title}
      aria-label={title}
      onClick={onClick}
    >
      <IconComponent className='p-1' />
    </button>
  );
}

function CustomControlGroupComponent({
  children,
  position = 'top-right',
}: {
  children: React.ReactNode;
  position?: ControlPosition;
}) {
  const [, setVersion] = useState(0);

  const ctrl = useControl<CustomControlClass>(
    () => {
      const forceUpdate = () => setVersion((v) => v + 1);
      return new CustomControlClass(forceUpdate);
    },
    { position }
  );

  const map = ctrl.getMap();
  const container = ctrl.getElement();

  return (
    map &&
    container &&
    createPortal(
      <div className='maplibregl-ctrl maplibregl-ctrl-group flex flex-col items-center justify-center !rounded-sm text-black hover:cursor-pointer'>
        {(Array.isArray(children) ? children : [children]).map(
          (child, i, arr) => ({
            ...child,
            props: {
              ...child.props,
              first: i === 0,
              last: i === arr.length - 1,
            },
          })
        )}
      </div>,
      container
    )
  );
}

export const CustomControl = React.memo(CustomControlComponent);
export const CustomControlGroup = React.memo(CustomControlGroupComponent);

// export default React.memo(CustomControlComponent);
