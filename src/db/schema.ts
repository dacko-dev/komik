import {
    pgTable,
    foreignKey,
    pgPolicy,
    uuid,
    timestamp,
    unique,
    text,
    bigint,
    integer,
    check,
    boolean,
    primaryKey,
    pgEnum,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { authenticatedRole, authUsers } from 'drizzle-orm/supabase'

export const contentVisibility = pgEnum('content_visibility', [
    'private',
    'public',
])

export const reactionType = pgEnum('reaction_type', [
    'like',
    'funny',
    'love',
    'wow',
    'sad',
    'angry',
])

export const reactions = pgTable(
    'reactions',
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        userId: uuid('user_id')
            .default(sql`auth.uid()`)
            .notNull(),
        comicId: uuid('comic_id').defaultRandom().notNull(),
        reactionType: reactionType('reaction_type').notNull(),
        createdAt: timestamp('created_at', {
            withTimezone: true,
            mode: 'string',
        })
            .default(sql`(now() AT TIME ZONE 'utc'::text)`)
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.comicId],
            foreignColumns: [comics.id],
            name: 'reactions_comic_id_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [profiles.id],
            name: 'reactions_user_id_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        pgPolicy('Enable read access for all users', {
            as: 'permissive',
            for: 'select',
            to: ['public'],
            using: sql`true`,
        }),
    ]
)

export const profiles = pgTable(
    'profiles',
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        createdAt: timestamp('created_at', {
            withTimezone: true,
            mode: 'string',
        })
            .default(sql`(now() AT TIME ZONE 'utc'::text)`)
            .notNull(),
        username: text().notNull(),
        avatar: text(),
        bio: text(),
        background: text(),
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        numberOfComics: bigint('number_of_comics', { mode: 'number' })
            .default(sql`'0'`)
            .notNull(),
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        numberOfSeries: bigint('number_of_series', { mode: 'number' })
            .default(sql`'0'`)
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.id],
            foreignColumns: [authUsers.id],
            name: 'users_id_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        unique('users_username_key').on(table.username),
        pgPolicy('Enable read access for all users', {
            as: 'permissive',
            for: 'select',
            to: ['public'],
            using: sql`true`,
        }),
    ]
)

export const reportReasons = pgTable(
    'report_reasons',
    {
        id: integer().primaryKey().generatedByDefaultAsIdentity({
            name: 'report_reasons_id_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 2147483647,
            cache: 1,
        }),
        name: text().notNull(),
        description: text().notNull(),
    },
    () => [
        pgPolicy('Enable read access for all users', {
            as: 'permissive',
            for: 'select',
            to: ['public'],
            using: sql`true`,
        }),
    ]
)

export const seriesBookmarks = pgTable(
    'series_bookmarks',
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        createdAt: timestamp('created_at', {
            withTimezone: true,
            mode: 'string',
        })
            .default(sql`(now() AT TIME ZONE 'utc'::text)`)
            .notNull(),
        seriesId: uuid('series_id'),
        userId: uuid('user_id')
            .default(sql`auth.uid()`)
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.seriesId],
            foreignColumns: [series.id],
            name: 'series_bookmarks_series_id_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [profiles.id],
            name: 'series_bookmarks_user_id_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        pgPolicy('Enable insert for authenticated users only', {
            as: 'permissive',
            for: 'insert',
            to: authenticatedRole,
            withCheck: sql`true`,
        }),
    ]
)

export const collections = pgTable(
    'collections',
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        createdAt: timestamp('created_at', {
            withTimezone: true,
            mode: 'string',
        })
            .default(sql`(now() AT TIME ZONE 'utc'::text)`)
            .notNull(),
        updatedAt: timestamp('updated_at', {
            withTimezone: true,
            mode: 'string',
        })
            .default(sql`(now() AT TIME ZONE 'utc'::text)`)
            .notNull(),
        name: text().notNull(),
        slug: text().notNull(),
        description: text(),
        thumbnail: text(),
        seriesId: uuid('series_id'),
        userId: uuid('user_id')
            .default(sql`auth.uid()`)
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.seriesId],
            foreignColumns: [series.id],
            name: 'collections_series_id_fkey',
        })
            .onUpdate('cascade')
            .onDelete('set null'),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [profiles.id],
            name: 'collections_user_id_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        unique('comic_series_collection_slug_key').on(table.slug),
        pgPolicy('Enable read access for all users', {
            as: 'permissive',
            for: 'select',
            to: ['public'],
            using: sql`true`,
        }),
        pgPolicy('Enable insert for authenticated users only', {
            as: 'permissive',
            for: 'insert',
            to: authenticatedRole,
        }),
        pgPolicy('Enable delete for users based on user_id', {
            as: 'permissive',
            for: 'delete',
            to: authenticatedRole,
        }),
        pgPolicy('Enable update for users based on user_id', {
            as: 'permissive',
            for: 'update',
            to: authenticatedRole,
        }),
    ]
)

export const comics = pgTable(
    'comics',
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        createdAt: timestamp('created_at', {
            withTimezone: true,
            mode: 'string',
        })
            .default(sql`(now() AT TIME ZONE 'utc'::text)`)
            .notNull(),
        updatedAt: timestamp('updated_at', {
            withTimezone: true,
            mode: 'string',
        })
            .default(sql`(now() AT TIME ZONE 'utc'::text)`)
            .notNull(),
        title: text().notNull(),
        description: text(),
        seriesId: text('series_id'),
        language: text().default("'en'"),
        visibility: text(),
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        totalViews: bigint('total_views', { mode: 'number' }).default(sql`'0'`),
        userId: uuid('user_id')
            .default(sql`auth.uid()`)
            .notNull(),
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        totalReactions: bigint('total_reactions', { mode: 'number' })
            .default(sql`'0'`)
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [profiles.id],
            name: 'comics_user_id_fkey1',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        pgPolicy('Enable insert for authenticated users only', {
            as: 'permissive',
            for: 'insert',
            to: authenticatedRole,
            withCheck: sql`true`,
        }),
        pgPolicy('Enable delete for users based on user_id', {
            as: 'permissive',
            for: 'delete',
            to: authenticatedRole,
        }),
        pgPolicy('Enable update for users based on user_id', {
            as: 'permissive',
            for: 'update',
            to: authenticatedRole,
        }),
        pgPolicy('Enable read access for all users for public content', {
            as: 'permissive',
            for: 'select',
            to: ['public'],
        }),
        pgPolicy('Enable read access for creators of private content', {
            as: 'permissive',
            for: 'select',
            to: authenticatedRole,
        }),
        check('comics_description_check', sql`length(description) < 500`),
        check('comics_title_check', sql`length(title) < 50`),
        check('comics_total_reactions_check', sql`total_reactions >= 0`),
        check('comics_total_views_check', sql`total_views >= 0`),
    ]
)

export const panels = pgTable(
    'panels',
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        comicId: uuid('comic_id'), // panel is not required to be in a comic
        image: text().notNull(),
        order: integer('order').notNull(),
        createdAt: timestamp('created_at', {
            withTimezone: true,
            mode: 'string',
        })
            .default(sql`(now() AT TIME ZONE 'utc'::text)`)
            .notNull(),
        updatedAt: timestamp('updated_at', {
            withTimezone: true,
            mode: 'string',
        })
            .default(sql`(now() AT TIME ZONE 'utc'::text)`)
            .notNull(),
        userId: uuid('user_id')
            .default(sql`auth.uid()`)
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.comicId],
            foreignColumns: [comics.id],
            name: 'panels_comic_id_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [profiles.id],
            name: 'panels_user_id_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        pgPolicy('Enable insert for authenticated users only', {
            as: 'permissive',
            for: 'insert',
            to: authenticatedRole,
            withCheck: sql`true`,
        }),
        pgPolicy('Enable delete for users based on user_id', {
            as: 'permissive',
            for: 'delete',
            to: authenticatedRole,
        }),
        pgPolicy('Enable update for users based on user_id', {
            as: 'permissive',
            for: 'update',
            to: authenticatedRole,
            withCheck: sql`true`,
        }),
    ]
)

export const comicComments = pgTable(
    'comic_comments',
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        createdAt: timestamp('created_at', {
            withTimezone: true,
            mode: 'string',
        })
            .default(sql`(now() AT TIME ZONE 'utc'::text)`)
            .notNull(),
        userId: uuid('user_id')
            .default(sql`auth.uid()`)
            .notNull(),
        comicId: uuid('comic_id').notNull(),
        content: text().notNull(),
        updatedAt: timestamp('updated_at', {
            withTimezone: true,
            mode: 'string',
        })
            .default(sql`(now() AT TIME ZONE 'utc'::text)`)
            .notNull(),
        lastEditedAt: timestamp('last_edited_at', {
            withTimezone: true,
            mode: 'string',
        }),
        hasHistory: boolean('has_history').default(false).notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.comicId],
            foreignColumns: [comics.id],
            name: 'comic_comments_comic_id_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [profiles.id],
            name: 'comic_comments_user_id_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        pgPolicy('Enable insert for authenticated users only', {
            as: 'permissive',
            for: 'insert',
            to: authenticatedRole,
            withCheck: sql`true`,
        }),
        pgPolicy('Enable delete for users based on user_id', {
            as: 'permissive',
            for: 'delete',
            to: authenticatedRole,
            using: sql`true`,
        }),
        pgPolicy('Enable update for users based on user_id', {
            as: 'permissive',
            for: 'update',
            to: authenticatedRole,
            using: sql`true`,
            withCheck: sql`true`,
        }),
    ]
)

export const series = pgTable(
    'series',
    {
        name: text().notNull(),
        description: text(),
        thumbnail: text(),
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        totalComics: bigint('total_comics', { mode: 'number' })
            .default(sql`'0'`)
            .notNull(),
        createdAt: timestamp('created_at', {
            withTimezone: true,
            mode: 'string',
        })
            .default(sql`(now() AT TIME ZONE 'utc'::text)`)
            .notNull(),
        updatetAt: timestamp('updatet_at', {
            withTimezone: true,
            mode: 'string',
        })
            .default(sql`(now() AT TIME ZONE 'utc'::text)`)
            .notNull(),
        id: uuid().defaultRandom().primaryKey().notNull(),
        slug: text().notNull(),
        userId: uuid('user_id')
            .default(sql`auth.uid()`)
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [profiles.id],
            name: 'series_user_id_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        unique('comics_series_name_key').on(table.name),
        unique('comic_series_id_key').on(table.id),
        unique('comic_series_slug_key').on(table.slug),
        pgPolicy('Enable insert for authenticated users only', {
            as: 'permissive',
            for: 'insert',
            to: authenticatedRole,
            withCheck: sql`true`,
        }),
        pgPolicy('Enable delete for users based on user_id', {
            as: 'permissive',
            for: 'delete',
            to: authenticatedRole,
            using: sql`true`,
        }),
        pgPolicy('Enable update for users based on user_id', {
            as: 'permissive',
            for: 'update',
            to: authenticatedRole,
            using: sql`true`,
            withCheck: sql`true`,
        }),
    ]
)

export const comicCommentHistory = pgTable(
    'comic_comment_history',
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        commentId: uuid('comment_id').defaultRandom().notNull(),
        previousContent: text('previous_content').notNull(),
        editedAt: timestamp('edited_at', { withTimezone: true, mode: 'string' })
            .default(sql`(now() AT TIME ZONE 'utc'::text)`)
            .notNull(),
    },
    () => [
        pgPolicy('Enable insert for authenticated users only', {
            as: 'permissive',
            for: 'insert',
            to: ['authenticated'],
            withCheck: sql`true`,
        }),
    ]
)

export const comicBookmarks = pgTable(
    'comic_bookmarks',
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        createdAt: timestamp('created_at', {
            withTimezone: true,
            mode: 'string',
        })
            .default(sql`(now() AT TIME ZONE 'utc'::text)`)
            .notNull(),
        comicId: uuid('comic_id').notNull(),
        userId: uuid('user_id')
            .default(sql`auth.uid()`)
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.comicId],
            foreignColumns: [comics.id],
            name: 'bookmarks_comic_id_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [profiles.id],
            name: 'bookmarks_user_id_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        pgPolicy('Enable insert for authenticated users only', {
            as: 'permissive',
            for: 'insert',
            to: authenticatedRole,
            withCheck: sql`true`,
        }),
        pgPolicy('Enable delete for users based on user_id', {
            as: 'permissive',
            for: 'delete',
            to: ['public'],
            using: sql`true`,
        }),
        pgPolicy('Enable read access for users to their bookmarks', {
            as: 'permissive',
            for: 'select',
            to: authenticatedRole,
            using: sql`true`,
        }),
    ]
)

export const notifications = pgTable(
    'notifications',
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        userId: uuid('user_id')
            .default(sql`auth.uid()`)
            .notNull(),
        content: text().notNull(),
        title: text().notNull(),
        isRead: boolean('is_read').default(false).notNull(),
        createdAt: timestamp('created_at', {
            withTimezone: true,
            mode: 'string',
        })
            .default(sql`(now() AT TIME ZONE 'utc'::text)`)
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.userId],
            foreignColumns: [profiles.id],
            name: 'notifications_user_id_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        pgPolicy('Enable read access for reciepent user_id', {
            as: 'permissive',
            for: 'select',
            to: authenticatedRole,
            using: sql`true`,
        }),
    ]
)

export const tags = pgTable(
    'tags',
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        createdAt: timestamp('created_at', {
            withTimezone: true,
            mode: 'string',
        })
            .default(sql`(now() AT TIME ZONE 'utc'::text)`)
            .notNull(),
        slug: text().notNull(),
        name: text().notNull(),
    },
    (table) => [
        unique('tags_slug_key').on(table.slug),
        unique('tags_name_key').on(table.name),
        pgPolicy('Enable read access for all users', {
            as: 'permissive',
            for: 'select',
            to: ['public'],
            using: sql`true`,
        }),
        pgPolicy('Enable insert for authenticated users only', {
            as: 'permissive',
            for: 'insert',
            to: authenticatedRole,
        }),
    ]
)

export const reports = pgTable(
    'reports',
    {
        id: uuid().defaultRandom().primaryKey().notNull(),
        createdAt: timestamp('created_at', {
            withTimezone: true,
            mode: 'string',
        })
            .default(sql`(now() AT TIME ZONE 'utc'::text)`)
            .notNull(),
        comicId: uuid('comic_id').defaultRandom(),
        userId: uuid('user_id'),
        description: text(),
        // You can use { mode: "bigint" } if numbers are exceeding js number limitations
        reasonId: bigint('reason_id', { mode: 'number' }).notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.comicId],
            foreignColumns: [comics.id],
            name: 'reports_comic_id_fkey',
        })
            .onUpdate('cascade')
            .onDelete('set null'),
        foreignKey({
            columns: [table.reasonId],
            foreignColumns: [reportReasons.id],
            name: 'reports_reason_id_fkey',
        })
            .onUpdate('cascade')
            .onDelete('restrict'),
        foreignKey({
            columns: [table.userId],
            foreignColumns: [profiles.id],
            name: 'reports_user_id_fkey',
        })
            .onUpdate('cascade')
            .onDelete('set null'),
        pgPolicy('Enable insert for all users', {
            as: 'permissive',
            for: 'insert',
            to: ['public'],
            withCheck: sql`true`,
        }),
    ]
)

export const genres = pgTable(
    'genres',
    {
        createdAt: timestamp('created_at', {
            withTimezone: true,
            mode: 'string',
        })
            .default(sql`(now() AT TIME ZONE 'utc'::text)`)
            .notNull(),
        updatedAt: timestamp('updated_at', {
            withTimezone: true,
            mode: 'string',
        })
            .default(sql`(now() AT TIME ZONE 'utc'::text)`)
            .notNull(),
        name: text().notNull(),
        description: text(),
        slug: text().notNull(),
        icon: text(),
        id: uuid().defaultRandom().primaryKey().notNull(),
    },
    (table) => [
        unique('comic_genres_slug_key').on(table.slug),
        unique('genres_id_key').on(table.id),
        pgPolicy('Enable read access for all users', {
            as: 'permissive',
            for: 'select',
            to: ['public'],
            using: sql`true`,
        }),
    ]
)

export const seriesGenres = pgTable(
    'series_genres',
    {
        seriesId: uuid('series_id').notNull(),
        genreD: uuid('genre_d').notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.genreD],
            foreignColumns: [genres.id],
            name: 'series_genres_genre_d_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        foreignKey({
            columns: [table.seriesId],
            foreignColumns: [series.id],
            name: 'series_genres_series_id_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        primaryKey({
            columns: [table.seriesId, table.genreD],
            name: 'series_genres_pkey',
        }),
        pgPolicy('Enable read access for all users', {
            as: 'permissive',
            for: 'select',
            to: ['public'],
            using: sql`true`,
        }),
    ]
)

export const comicsGenres = pgTable(
    'comics_genres',
    {
        comicId: uuid('comic_id').defaultRandom().notNull(),
        genreId: uuid('genre_id').defaultRandom().notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.comicId],
            foreignColumns: [comics.id],
            name: 'comics_genres_comic_id_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        foreignKey({
            columns: [table.genreId],
            foreignColumns: [genres.id],
            name: 'comics_genres_genre_id_fkey',
        })
            .onUpdate('cascade')
            .onDelete('cascade'),
        primaryKey({
            columns: [table.comicId, table.genreId],
            name: 'comics_genres_pkey',
        }),
        pgPolicy('Enable read access for all users', {
            as: 'permissive',
            for: 'select',
            to: ['public'],
            using: sql`true`,
        }),
    ]
)
