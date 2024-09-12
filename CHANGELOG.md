<!--
Guiding Principles
- Changelogs are for humans, not machines.
- There should be an entry for every single version.
- The same types of changes should be grouped.
- Versions and sections should be linkable.
- The latest version comes first.
- The release date of each version is displayed.
- Mention whether you follow Semantic Versioning.

Types of changes
- Added for new features.
- Changed for changes in existing functionality.
- Deprecated for soon-to-be removed features.
- Removed for now removed features.
- Fixed for any bug fixes.
- Security in case of vulnerabilities.
- Breaking changes for break in new revision
- Other for notable changes that do not
 -->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unpublished

### Fixed

-   Position is once again changed if there's overflow (settings permitted)

## [1.0.2] - 2024-07-30

<small>[Compare to previous release][comp:1.0.2]</small>

### Fixed

-   Fixed the position data when a parent element was scrolled

## [1.0.1] - 2023-11-14

<small>[Compare to previous release][comp:1.0.1]</small>

### Fixed

-   The position data now respects the window scroll position
-   The package module outputs now includes the collision handler (rather than being bundled)

### Changes

-   Developer dependency bumps (no user-facing changes)
-   Update publish actions and node versions (no user-facing changes)

## [1.0.0] - 2022-12-12

**This was the first release**

[comp:1.0.2]: https://github.com/TopMarksDevelopment/JavaScript.Position/compare/v1.0.1...v1.0.2
[1.0.2]: https://github.com/TopMarksDevelopment/JavaScript.Position/release/tag/v1.0.2
[comp:1.0.1]: https://github.com/TopMarksDevelopment/JavaScript.Position/compare/v1.0.0...v1.0.1
[1.0.1]: https://github.com/TopMarksDevelopment/JavaScript.Position/release/tag/v1.0.1
[1.0.0]: https://github.com/TopMarksDevelopment/JavaScript.Position/release/tag/v1.0.0
