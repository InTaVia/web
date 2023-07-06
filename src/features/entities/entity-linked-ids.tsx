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
            const url = String(new URL(link.id, link.provider?.baseUrl));

            return (
              <li key={link.id}>
                <a className="underline" href={url}>
                  {link.provider?.label ?? url}
                </a>
              </li>
            );
          })}
        </ul>
      </dd>
    </div>
  );
}
