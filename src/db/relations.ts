import { relations } from 'drizzle-orm/relations'
import {
    comics,
    reactions,
    profiles,
    series,
    seriesBookmarks,
    collections,
    comicComments,
    comicBookmarks,
    notifications,
    reports,
    reportReasons,
    genres,
    seriesGenres,
    comicsGenres,
} from './schema'
import { authUsers } from 'drizzle-orm/supabase'

export const reactionsRelations = relations(reactions, ({ one }) => ({
    comic: one(comics, {
        fields: [reactions.comicId],
        references: [comics.id],
    }),
    profile: one(profiles, {
        fields: [reactions.userId],
        references: [profiles.id],
    }),
}))

export const comicsRelations = relations(comics, ({ one, many }) => ({
    reactions: many(reactions),
    profile: one(profiles, {
        fields: [comics.userId],
        references: [profiles.id],
    }),
    comicComments: many(comicComments),
    comicBookmarks: many(comicBookmarks),
    reports: many(reports),
    comicsGenres: many(comicsGenres),
}))

export const profilesRelations = relations(profiles, ({ one, many }) => ({
    reactions: many(reactions),
    usersInAuth: one(authUsers, {
        fields: [profiles.id],
        references: [authUsers.id],
    }),
    seriesBookmarks: many(seriesBookmarks),
    collections: many(collections),
    comics: many(comics),
    comicComments: many(comicComments),
    series: many(series),
    comicBookmarks: many(comicBookmarks),
    notifications: many(notifications),
    reports: many(reports),
}))

export const usersInAuthRelations = relations(authUsers, ({ many }) => ({
    profiles: many(profiles),
}))

export const seriesBookmarksRelations = relations(
    seriesBookmarks,
    ({ one }) => ({
        series: one(series, {
            fields: [seriesBookmarks.seriesId],
            references: [series.id],
        }),
        profile: one(profiles, {
            fields: [seriesBookmarks.userId],
            references: [profiles.id],
        }),
    })
)

export const seriesRelations = relations(series, ({ one, many }) => ({
    seriesBookmarks: many(seriesBookmarks),
    collections: many(collections),
    profile: one(profiles, {
        fields: [series.userId],
        references: [profiles.id],
    }),
    seriesGenres: many(seriesGenres),
}))

export const collectionsRelations = relations(collections, ({ one }) => ({
    series: one(series, {
        fields: [collections.seriesId],
        references: [series.id],
    }),
    profile: one(profiles, {
        fields: [collections.userId],
        references: [profiles.id],
    }),
}))

export const comicCommentsRelations = relations(comicComments, ({ one }) => ({
    comic: one(comics, {
        fields: [comicComments.comicId],
        references: [comics.id],
    }),
    profile: one(profiles, {
        fields: [comicComments.userId],
        references: [profiles.id],
    }),
}))

export const comicBookmarksRelations = relations(comicBookmarks, ({ one }) => ({
    comic: one(comics, {
        fields: [comicBookmarks.comicId],
        references: [comics.id],
    }),
    profile: one(profiles, {
        fields: [comicBookmarks.userId],
        references: [profiles.id],
    }),
}))

export const notificationsRelations = relations(notifications, ({ one }) => ({
    profile: one(profiles, {
        fields: [notifications.userId],
        references: [profiles.id],
    }),
}))

export const reportsRelations = relations(reports, ({ one }) => ({
    comic: one(comics, {
        fields: [reports.comicId],
        references: [comics.id],
    }),
    reportReason: one(reportReasons, {
        fields: [reports.reasonId],
        references: [reportReasons.id],
    }),
    profile: one(profiles, {
        fields: [reports.userId],
        references: [profiles.id],
    }),
}))

export const reportReasonsRelations = relations(reportReasons, ({ many }) => ({
    reports: many(reports),
}))

export const seriesGenresRelations = relations(seriesGenres, ({ one }) => ({
    genre: one(genres, {
        fields: [seriesGenres.genreD],
        references: [genres.id],
    }),
    series: one(series, {
        fields: [seriesGenres.seriesId],
        references: [series.id],
    }),
}))

export const genresRelations = relations(genres, ({ many }) => ({
    seriesGenres: many(seriesGenres),
    comicsGenres: many(comicsGenres),
}))

export const comicsGenresRelations = relations(comicsGenres, ({ one }) => ({
    comic: one(comics, {
        fields: [comicsGenres.comicId],
        references: [comics.id],
    }),
    genre: one(genres, {
        fields: [comicsGenres.genreId],
        references: [genres.id],
    }),
}))
