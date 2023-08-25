import type { Entity } from '@intavia/api-client';

interface EntityLinkedIdsProps {
  links: Entity['linkedIds'];
}

export function EntityLinkedIds(props: EntityLinkedIdsProps): JSX.Element | null {
  const { links } = props;

  if (links == null || links.length === 0) return null;

  return (
    <div className="grid gap-1">
      <dt className="font-bold uppercase text-neutral-700">Linked ids</dt>
      <dd>
        <ul role="list">
          {links.map((link) => {
            return (
              <li key={link.url}>
                <a className="underline" href={link.url}>
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>
      </dd>
    </div>
  );
}
