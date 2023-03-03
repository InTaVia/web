import type { Entity, EntityKind, Event, VocabularyEntry } from "@intavia/api-client";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { PURGE } from "redux-persist";

import { service as intaviaApiService } from "@/api/intavia.service";
import type { RootState } from "@/app/store";

interface IndexedEntities {
	byId: Record<Entity["id"], Entity>;
	byKind: {
		[Kind in EntityKind]: Record<Entity["id"], Extract<Entity, { kind: Kind }>>;
	};
}

interface IndexedEvents {
	byId: Record<Event["id"], Event>;
}

interface IndexedVocabularies {
	byVocabularyEntryId: Record<VocabularyEntry["id"], VocabularyEntry>;
	byVocabularyId: Record<string, Record<VocabularyEntry["id"], VocabularyEntry>>;
}

interface IntaviaState {
	entities: {
		upstream: IndexedEntities;
		local: IndexedEntities;
	};
	events: {
		upstream: IndexedEvents;
		local: IndexedEvents;
	};
	vocabularies: {
		upstream: IndexedVocabularies;
		local: IndexedVocabularies;
	};
}

const initialState: IntaviaState = {
	entities: {
		upstream: {
			byId: {},
			byKind: {
				"cultural-heritage-object": {},
				group: {},
				"historical-event": {},
				person: {},
				place: {},
			},
		},
		local: {
			byId: {},
			byKind: {
				"cultural-heritage-object": {},
				group: {},
				"historical-event": {},
				person: {},
				place: {},
			},
		},
	},
	events: {
		upstream: {
			byId: {},
		},
		local: {
			byId: {},
		},
	},
	vocabularies: {
		upstream: {
			byVocabularyEntryId: {},
			byVocabularyId: {},
		},
		local: {
			byVocabularyEntryId: {},
			byVocabularyId: {},
		},
	},
};

export const slice = createSlice({
	name: "intavia",
	initialState,
	reducers: {
		addLocalEntity(state, action: PayloadAction<Entity>) {
			const entity = action.payload;
			state.entities.local.byId[entity.id] = entity;
			state.entities.local.byKind[entity.kind][entity.id] = entity;
		},
		addLocalEntities(state, action: PayloadAction<Array<Entity>>) {
			const entities = action.payload;
			entities.forEach((entity) => {
				state.entities.local.byId[entity.id] = entity;
				state.entities.local.byKind[entity.kind][entity.id] = entity;
			});
		},
		removeLocalEntity(state, action: PayloadAction<Entity["id"]>) {
			const id = action.payload;
			const entity = state.entities.local.byId[id];
			if (entity != null) {
				delete state.entities.local.byId[entity.id];
				delete state.entities.local.byKind[entity.kind][entity.id];
			}
		},
		removeLocalEntities(state, action: PayloadAction<Array<Entity["id"]>>) {
			const ids = action.payload;
			ids.forEach((id) => {
				const entity = state.entities.local.byId[id];
				if (entity != null) {
					delete state.entities.local.byId[entity.id];
					delete state.entities.local.byKind[entity.kind][entity.id];
				}
			});
		},
		addLocalEvent(state, action: PayloadAction<Event>) {
			const event = action.payload;
			state.events.local.byId[event.id] = event;
		},
		addLocalEvents(state, action: PayloadAction<Array<Event>>) {
			const events = action.payload;
			events.forEach((event) => {
				state.events.local.byId[event.id] = event;
			});
		},
		removeLocalEvent(state, action: PayloadAction<Event["id"]>) {
			const id = action.payload;
			delete state.events.local.byId[id];
		},
		removeLocalEvents(state, action: PayloadAction<Array<Event["id"]>>) {
			const ids = action.payload;
			ids.forEach((id) => {
				const event = state.events.local.byId[id];
				if (event != null) {
					delete state.events.local.byId[event.id];
				}
			});
		},
		addLocalVocabulary(
			state,
			action: PayloadAction<{ id: string; entries: Array<VocabularyEntry> }>,
		) {
			const { id, entries } = action.payload;
			entries.forEach((entry) => {
				state.vocabularies.local.byVocabularyEntryId[entry.id] = entry;
				if (state.vocabularies.local.byVocabularyId[id] == null) {
					state.vocabularies.local.byVocabularyId[id] = {};
				}
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				state.vocabularies.local.byVocabularyId[id]![entry.id] = entry;
			});
		},
		clearEntities(state) {
			state.entities = initialState.entities;
		},
		clearEvents(state) {
			state.events = initialState.events;
		},
		clearVocabularies(state) {
			state.vocabularies = initialState.vocabularies;
		},
		clear() {
			return initialState;
		},
	},
	extraReducers(builder) {
		builder.addCase(PURGE, () => {
			return initialState;
		});

		builder.addMatcher(
			intaviaApiService.endpoints.getEntityById.matchFulfilled,
			(state, action) => {
				const entity = action.payload;

				state.entities.upstream.byId[entity.id] = entity;
				state.entities.upstream.byKind[entity.kind][entity.id] = entity;
			},
		);
		builder.addMatcher(
			intaviaApiService.endpoints.retrieveEntitiesByIds.matchFulfilled,
			(state, action) => {
				const entities = action.payload.results;

				entities.forEach((entity) => {
					state.entities.upstream.byId[entity.id] = entity;
					state.entities.upstream.byKind[entity.kind][entity.id] = entity;
				});
			},
		);
		builder.addMatcher(
			intaviaApiService.endpoints.searchEntities.matchFulfilled,
			(state, action) => {
				const entities = action.payload.results;

				entities.forEach((entity) => {
					state.entities.upstream.byId[entity.id] = entity;
					state.entities.upstream.byKind[entity.kind][entity.id] = entity;
				});
			},
		);

		builder.addMatcher(intaviaApiService.endpoints.getEventById.matchFulfilled, (state, action) => {
			const event = action.payload;
			state.events.upstream.byId[event.id] = event;
		});
		builder.addMatcher(
			intaviaApiService.endpoints.retrieveEventsByIds.matchFulfilled,
			(state, action) => {
				const events = action.payload.results;
				events.forEach((event) => {
					state.events.upstream.byId[event.id] = event;
				});
			},
		);
		builder.addMatcher(intaviaApiService.endpoints.searchEvents.matchFulfilled, (state, action) => {
			const events = action.payload.results;
			events.forEach((event) => {
				state.events.upstream.byId[event.id] = event;
			});
		});

		builder.addMatcher(
			intaviaApiService.endpoints.getEventKindById.matchFulfilled,
			(state, action) => {
				const entry = action.payload;
				state.vocabularies.upstream.byVocabularyEntryId[entry.id] = entry;
				if (state.vocabularies.upstream.byVocabularyId["event-kind"] == null) {
					state.vocabularies.upstream.byVocabularyId["event-kind"] = {};
				}
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				state.vocabularies.upstream.byVocabularyId["event-kind"]![entry.id] = entry;
			},
		);
		builder.addMatcher(
			intaviaApiService.endpoints.retrieveEventKindsByIds.matchFulfilled,
			(state, action) => {
				const entries = action.payload.results;
				entries.forEach((entry) => {
					state.vocabularies.upstream.byVocabularyEntryId[entry.id] = entry;
					if (state.vocabularies.upstream.byVocabularyId["event-kind"] == null) {
						state.vocabularies.upstream.byVocabularyId["event-kind"] = {};
					}
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					state.vocabularies.upstream.byVocabularyId["event-kind"]![entry.id] = entry;
				});
			},
		);
		builder.addMatcher(
			intaviaApiService.endpoints.searchEventKinds.matchFulfilled,
			(state, action) => {
				const entries = action.payload.results;
				entries.forEach((entry) => {
					state.vocabularies.upstream.byVocabularyEntryId[entry.id] = entry;
					if (state.vocabularies.upstream.byVocabularyId["event-kind"] == null) {
						state.vocabularies.upstream.byVocabularyId["event-kind"] = {};
					}
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					state.vocabularies.upstream.byVocabularyId["event-kind"]![entry.id] = entry;
				});
			},
		);

		builder.addMatcher(
			intaviaApiService.endpoints.getRelationRoleById.matchFulfilled,
			(state, action) => {
				const entry = action.payload;
				state.vocabularies.upstream.byVocabularyEntryId[entry.id] = entry;
				if (state.vocabularies.upstream.byVocabularyId["role"] == null) {
					state.vocabularies.upstream.byVocabularyId["role"] = {};
				}
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				state.vocabularies.upstream.byVocabularyId["role"]![entry.id] = entry;
			},
		);
		builder.addMatcher(
			intaviaApiService.endpoints.retrieveRelationRolesByIds.matchFulfilled,
			(state, action) => {
				const entries = action.payload.results;
				entries.forEach((entry) => {
					state.vocabularies.upstream.byVocabularyEntryId[entry.id] = entry;
					if (state.vocabularies.upstream.byVocabularyId["role"] == null) {
						state.vocabularies.upstream.byVocabularyId["role"] = {};
					}
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					state.vocabularies.upstream.byVocabularyId["role"]![entry.id] = entry;
				});
			},
		);
		builder.addMatcher(
			intaviaApiService.endpoints.searchRelationRoles.matchFulfilled,
			(state, action) => {
				const entries = action.payload.results;
				entries.forEach((entry) => {
					state.vocabularies.upstream.byVocabularyEntryId[entry.id] = entry;
					if (state.vocabularies.upstream.byVocabularyId["role"] == null) {
						state.vocabularies.upstream.byVocabularyId["role"] = {};
					}
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					state.vocabularies.upstream.byVocabularyId["role"]![entry.id] = entry;
				});
			},
		);

		builder.addMatcher(
			intaviaApiService.endpoints.getOccupationById.matchFulfilled,
			(state, action) => {
				const occupation = action.payload;
				state.vocabularies.upstream.byVocabularyEntryId[occupation.id] = occupation;
				if (state.vocabularies.upstream.byVocabularyId["occupation"] == null) {
					state.vocabularies.upstream.byVocabularyId["occupation"] = {};
				}
				state.vocabularies.upstream.byVocabularyId["occupation"][occupation.id] = occupation;
			},
		);
		builder.addMatcher(
			intaviaApiService.endpoints.retrieveOccupationsByIds.matchFulfilled,
			(state, action) => {
				const occupations = action.payload.results;
				occupations.forEach((occupation) => {
					state.vocabularies.upstream.byVocabularyEntryId[occupation.id] = occupation;
					if (state.vocabularies.upstream.byVocabularyId["occupation"] == null) {
						state.vocabularies.upstream.byVocabularyId["occupation"] = {};
					}
					state.vocabularies.upstream.byVocabularyId["occupation"][occupation.id] = occupation;
				});
			},
		);
		builder.addMatcher(
			intaviaApiService.endpoints.searchOccupations.matchFulfilled,
			(state, action) => {
				const occupations = action.payload.results;
				occupations.forEach((occupation) => {
					state.vocabularies.upstream.byVocabularyEntryId[occupation.id] = occupation;
					if (state.vocabularies.upstream.byVocabularyId["occupation"] == null) {
						state.vocabularies.upstream.byVocabularyId["occupation"] = {};
					}
					state.vocabularies.upstream.byVocabularyId["occupation"][occupation.id] = occupation;
				});
			},
		);
	},
});

export const {
	addLocalEntity,
	addLocalEntities,
	removeLocalEntity,
	removeLocalEntities,
	addLocalEvent,
	addLocalEvents,
	removeLocalEvent,
	removeLocalEvents,
	addLocalVocabulary,
	clearEntities,
	clearEvents,
	clearVocabularies,
	clear,
} = slice.actions;

export function selectUpstreamEntities(state: RootState) {
	return state.intavia.entities.upstream.byId;
}

export function selectLocalEntities(state: RootState) {
	return state.intavia.entities.local.byId;
}

export function selectEntities(state: RootState) {
	const upstreamEntities = selectUpstreamEntities(state);
	const localEntities = selectLocalEntities(state);

	const entities = { ...upstreamEntities, ...localEntities };

	return entities;
}

export function selectUpstreamEntitiesByKind(state: RootState) {
	return state.intavia.entities.upstream.byKind;
}

export function selectLocalEntitiesByKind(state: RootState) {
	return state.intavia.entities.local.byKind;
}

export function selectEntitiesByKind(state: RootState) {
	const upstreamEntitiesByKind = selectUpstreamEntitiesByKind(state);
	const localEntitiesByKind = selectLocalEntitiesByKind(state);

	const entitiesByKind = {
		"cultural-heritage-object": {
			...upstreamEntitiesByKind["cultural-heritage-object"],
			...localEntitiesByKind["cultural-heritage-object"],
		},
		group: {
			...upstreamEntitiesByKind.group,
			...localEntitiesByKind.group,
		},
		"historical-event": {
			...upstreamEntitiesByKind["historical-event"],
			...localEntitiesByKind["historical-event"],
		},
		person: {
			...upstreamEntitiesByKind.person,
			...localEntitiesByKind.person,
		},
		place: {
			...upstreamEntitiesByKind.place,
			...localEntitiesByKind.place,
		},
	};

	return entitiesByKind;
}

export function selectUpstreamEntityById(state: RootState, id: Entity["id"]) {
	return state.intavia.entities.upstream.byId[id];
}

export function selectLocalEntityById(state: RootState, id: Entity["id"]) {
	return state.intavia.entities.local.byId[id];
}

export function selectEntityById(state: RootState, id: Entity["id"]) {
	return selectLocalEntityById(state, id) ?? selectUpstreamEntityById(state, id);
}

export function selectHasLocalEntity(state: RootState, id: Entity["id"]) {
	return selectLocalEntityById(state, id) != null;
}

export function selectUpstreamEvents(state: RootState) {
	return state.intavia.events.upstream.byId;
}

export function selectLocalEvents(state: RootState) {
	return state.intavia.events.local.byId;
}

export function selectEvents(state: RootState) {
	const upstreamEvents = selectUpstreamEvents(state);
	const localEvents = selectLocalEvents(state);

	const events = { ...upstreamEvents, ...localEvents };

	return events;
}

export function selectUpstreamEventById(state: RootState, id: Event["id"]) {
	return state.intavia.events.upstream.byId[id];
}

export function selectLocalEventById(state: RootState, id: Event["id"]) {
	return state.intavia.events.local.byId[id];
}

export function selectEventById(state: RootState, id: Event["id"]) {
	return selectLocalEventById(state, id) ?? selectUpstreamEventById(state, id);
}

export function selectHasLocalEvent(state: RootState, id: Event["id"]) {
	return selectLocalEventById(state, id) != null;
}

export function selectUpstreamVocabularyEntries(state: RootState) {
	return state.intavia.vocabularies.upstream.byVocabularyEntryId;
}

export function selectLocalVocabularyEntries(state: RootState) {
	return state.intavia.vocabularies.local.byVocabularyEntryId;
}

export function selectVocabularyEntries(state: RootState) {
	const upstreamVocabularyEntries = selectUpstreamVocabularyEntries(state);
	const localVocabularyEntries = selectLocalVocabularyEntries(state);

	const vocabularyEntries = { ...upstreamVocabularyEntries, ...localVocabularyEntries };

	return vocabularyEntries;
}

export function selectLocalVocabularyById(state: RootState, id: string) {
	return state.intavia.vocabularies.local.byVocabularyId[id];
}

export function selectLocalVocabularyEntryById(state: RootState, id: VocabularyEntry["id"]) {
	return state.intavia.vocabularies.local.byVocabularyEntryId[id];
}
