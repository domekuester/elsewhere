# Destination Architecture

## Principle

Destination is a verified geographic relationship, never a visual guess. Visual worlds and collections may be curated immediately; country, region, island, and place relationships require approved metadata.

## Hierarchy

`Destination` represents a country or distinct territory. `Region` represents a meaningful subdivision such as La Réunion inside France. `Place` represents cities, neighbourhoods, beaches, mountains, public buildings, or landscapes. Photographs store stable relationship IDs and a generalized public location; exact coordinates remain private.

## Routes

- `/destinations/`
- `/destinations/[slug]/`
- `/places/[slug]/`
- Journey and story pages may reference destinations without duplicating location truth.

## Current state

Japan, Malaysia, Thailand, La Réunion, France, and Germany remain an editorial review index. The homepage and destination route do not attach photographs to those names. Each status clearly reads “Archive review in progress.”

## Future destination template

A verified destination may contain an authored opening image, visual mood, related journeys, places, people, stories, collections, and a restrained next path. It should never resemble a hotel-search or tourism-card grid. Counts are generated from relationships, not hard-coded marketing statistics.
