import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1604181332208 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'CREATE TABLE `country_translation` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `languageCode` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `baseId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `country` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `code` varchar(255) NOT NULL, `enabled` tinyint NOT NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `zone` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `channel` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `code` varchar(255) NOT NULL, `token` varchar(255) NOT NULL, `defaultLanguageCode` varchar(255) NOT NULL, `currencyCode` varchar(255) NOT NULL, `pricesIncludeTax` tinyint NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `defaultTaxZoneId` int NULL, `defaultShippingZoneId` int NULL, UNIQUE INDEX `IDX_06127ac6c6d913f4320759971d` (`code`), UNIQUE INDEX `IDX_842699fce4f3470a7d06d89de8` (`token`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `role` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `code` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, `permissions` text NOT NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `asset` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `type` varchar(255) NOT NULL, `mimeType` varchar(255) NOT NULL, `width` int NOT NULL DEFAULT 0, `height` int NOT NULL DEFAULT 0, `fileSize` int NOT NULL, `source` varchar(255) NOT NULL, `preview` varchar(255) NOT NULL, `focalPoint` text NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `facet_translation` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `languageCode` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `baseId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `facet` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `isPrivate` tinyint NOT NULL DEFAULT 0, `code` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, UNIQUE INDEX `IDX_0c9a5d053fdf4ebb5f0490b40f` (`code`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `facet_value_translation` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `languageCode` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `baseId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `facet_value` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `code` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `facetId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `product_option_translation` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `languageCode` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `baseId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `product_option` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `code` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `groupId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `product_option_group_translation` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `languageCode` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `baseId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `product_option_group` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `code` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `productId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `collection_asset` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `assetId` int NOT NULL, `position` int NOT NULL, `collectionId` int NOT NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `collection_translation` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `languageCode` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `slug` varchar(255) NOT NULL, `description` text NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `baseId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `collection` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `isRoot` tinyint NOT NULL DEFAULT 0, `position` int NOT NULL, `isPrivate` tinyint NOT NULL DEFAULT 0, `filters` text NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `featuredAssetId` int NULL, `parentId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `stock_movement` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `type` varchar(255) NOT NULL, `quantity` int NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `discriminator` varchar(255) NOT NULL, `productVariantId` int NULL, `orderItemId` int NULL, UNIQUE INDEX `REL_cbb0990e398bf7713aebdd3848` (`orderItemId`), INDEX `IDX_94e15d5f12d355d117390131ac` (`discriminator`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `tax_category` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `product_variant_asset` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `assetId` int NOT NULL, `position` int NOT NULL, `productVariantId` int NOT NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `product_variant_price` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `price` int NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `channelId` int NOT NULL, `variantId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `product_variant_translation` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `languageCode` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `baseId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      "CREATE TABLE `product_variant` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deletedAt` datetime NULL, `enabled` tinyint NOT NULL DEFAULT 1, `sku` varchar(255) NOT NULL, `lastPriceValue` int NOT NULL COMMENT 'Not used - actual price is stored in product_variant_price table', `stockOnHand` int NOT NULL DEFAULT 0, `trackInventory` tinyint NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `productId` int NULL, `featuredAssetId` int NULL, `taxCategoryId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `product_asset` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `assetId` int NOT NULL, `position` int NOT NULL, `productId` int NOT NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `product_translation` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `languageCode` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `slug` varchar(255) NOT NULL, `description` text NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `baseId` int NULL, UNIQUE INDEX `IDX_42187bb72520a713d625389489` (`languageCode`, `slug`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `product` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deletedAt` datetime NULL, `enabled` tinyint NOT NULL DEFAULT 1, `id` int NOT NULL AUTO_INCREMENT, `featuredAssetId` int NULL, `ownerId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `user` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deletedAt` datetime NULL, `identifier` varchar(255) NOT NULL, `verified` tinyint NOT NULL DEFAULT 0, `lastLogin` datetime NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `authentication_method` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `identifier` varchar(255) NULL, `passwordHash` varchar(255) NULL, `verificationToken` varchar(255) NULL, `passwordResetToken` varchar(255) NULL, `identifierChangeToken` varchar(255) NULL, `pendingIdentifier` varchar(255) NULL, `strategy` varchar(255) NULL, `externalIdentifier` varchar(255) NULL, `metadata` text NULL, `id` int NOT NULL AUTO_INCREMENT, `type` varchar(255) NOT NULL, `userId` int NULL, INDEX `IDX_a23445b2c942d8dfcae15b8de2` (`type`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `administrator` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deletedAt` datetime NULL, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NOT NULL, `emailAddress` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `userId` int NULL, UNIQUE INDEX `IDX_154f5c538b1576ccc277b1ed63` (`emailAddress`), UNIQUE INDEX `REL_1966e18ce6a39a82b19204704d` (`userId`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `customer_group` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      "CREATE TABLE `fulfillment` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `state` varchar(255) NOT NULL, `trackingCode` varchar(255) NOT NULL DEFAULT '', `method` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `payment` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `method` varchar(255) NOT NULL, `amount` int NOT NULL, `state` varchar(255) NOT NULL, `errorMessage` varchar(255) NULL, `transactionId` varchar(255) NULL, `metadata` text NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `orderId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `refund` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `items` int NOT NULL, `shipping` int NOT NULL, `adjustment` int NOT NULL, `total` int NOT NULL, `method` varchar(255) NOT NULL, `reason` varchar(255) NULL, `state` varchar(255) NOT NULL, `transactionId` varchar(255) NULL, `metadata` text NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `paymentId` int NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `order_item` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `unitPrice` int NOT NULL, `unitPriceIncludesTax` tinyint NOT NULL, `taxRate` decimal(5,2) NOT NULL, `pendingAdjustments` text NOT NULL, `cancelled` tinyint NOT NULL DEFAULT 0, `id` int NOT NULL AUTO_INCREMENT, `fulfillmentId` int NULL, `refundId` int NULL, `lineId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `order_line` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `productVariantId` int NULL, `taxCategoryId` int NULL, `featuredAssetId` int NULL, `orderId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `promotion` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deletedAt` datetime NULL, `startsAt` datetime NULL, `endsAt` datetime NULL, `couponCode` varchar(255) NULL, `perCustomerUsageLimit` int NULL, `name` varchar(255) NOT NULL, `enabled` tinyint NOT NULL, `conditions` text NOT NULL, `actions` text NOT NULL, `priorityScore` int NOT NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `shipping_method` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deletedAt` datetime NULL, `code` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, `checker` text NOT NULL, `calculator` text NOT NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `order` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `code` varchar(255) NOT NULL, `state` varchar(255) NOT NULL, `active` tinyint NOT NULL DEFAULT 1, `orderPlacedAt` datetime NULL, `couponCodes` text NOT NULL, `pendingAdjustments` text NOT NULL, `shippingAddress` text NOT NULL, `billingAddress` text NOT NULL, `currencyCode` varchar(255) NOT NULL, `subTotalBeforeTax` int NOT NULL, `subTotal` int NOT NULL, `shipping` int NOT NULL DEFAULT 0, `shippingWithTax` int NOT NULL DEFAULT 0, `id` int NOT NULL AUTO_INCREMENT, `shippingMethodId` int NULL, `taxZoneId` int NULL, `customerId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `customer` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deletedAt` datetime NULL, `title` varchar(255) NULL, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NOT NULL, `phoneNumber` varchar(255) NULL, `emailAddress` varchar(255) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `userId` int NULL, UNIQUE INDEX `REL_3f62b42ed23958b120c235f74d` (`userId`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      "CREATE TABLE `address` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `fullName` varchar(255) NOT NULL DEFAULT '', `company` varchar(255) NOT NULL DEFAULT '', `streetLine1` varchar(255) NOT NULL, `streetLine2` varchar(255) NOT NULL DEFAULT '', `city` varchar(255) NOT NULL DEFAULT '', `province` varchar(255) NOT NULL DEFAULT '', `postalCode` varchar(255) NOT NULL DEFAULT '', `phoneNumber` varchar(255) NOT NULL DEFAULT '', `defaultShippingAddress` tinyint NOT NULL DEFAULT 0, `defaultBillingAddress` tinyint NOT NULL DEFAULT 0, `id` int NOT NULL AUTO_INCREMENT, `customerId` int NULL, `countryId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `payment_method` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `code` varchar(255) NOT NULL, `enabled` tinyint NOT NULL, `configArgs` text NOT NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `session` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `token` varchar(255) NOT NULL, `expires` datetime NOT NULL, `invalidated` tinyint NOT NULL, `authenticationStrategy` varchar(255) NULL, `id` int NOT NULL AUTO_INCREMENT, `activeOrderId` int NULL, `activeChannelId` int NULL, `type` varchar(255) NOT NULL, `userId` int NULL, UNIQUE INDEX `IDX_232f8e85d7633bd6ddfad42169` (`token`), INDEX `IDX_e5598363000cab9d9116bd5835` (`type`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `tax_rate` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, `enabled` tinyint NOT NULL, `value` decimal(5,2) NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `categoryId` int NULL, `zoneId` int NULL, `customerGroupId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `global_settings` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `availableLanguages` text NOT NULL, `trackInventory` tinyint NOT NULL DEFAULT 0, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `history_entry` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `type` varchar(255) NOT NULL, `isPublic` tinyint NOT NULL, `data` text NOT NULL, `id` int NOT NULL AUTO_INCREMENT, `discriminator` varchar(255) NOT NULL, `administratorId` int NULL, `customerId` int NULL, `orderId` int NULL, INDEX `IDX_f3a761f6bcfabb474b11e1e51f` (`discriminator`), PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `search_index_item` (`languageCode` varchar(255) NOT NULL, `enabled` tinyint NOT NULL, `productName` varchar(255) NOT NULL, `productVariantName` varchar(255) NOT NULL, `description` text NOT NULL, `slug` varchar(255) NOT NULL, `sku` varchar(255) NOT NULL, `price` int NOT NULL, `priceWithTax` int NOT NULL, `facetIds` text NOT NULL, `facetValueIds` text NOT NULL, `collectionIds` text NOT NULL, `collectionSlugs` text NOT NULL, `channelIds` text NOT NULL, `productPreview` varchar(255) NOT NULL, `productPreviewFocalPoint` text NULL, `productVariantPreview` varchar(255) NOT NULL, `productVariantPreviewFocalPoint` text NULL, `productVariantId` int NOT NULL, `channelId` int NOT NULL, `productId` int NOT NULL, `productAssetId` int NULL, `productVariantAssetId` int NULL, FULLTEXT INDEX `IDX_6fb55742e13e8082954d0436dc` (`productName`), FULLTEXT INDEX `IDX_d8791f444a8bf23fe4c1bc020c` (`productVariantName`), FULLTEXT INDEX `IDX_9a5a6a556f75c4ac7bfdd03410` (`description`), PRIMARY KEY (`languageCode`, `productVariantId`, `channelId`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `job_record` (`createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `queueName` varchar(255) NOT NULL, `data` text NULL, `state` varchar(255) NOT NULL, `progress` int NOT NULL, `result` text NULL, `error` varchar(255) NULL, `startedAt` datetime(6) NULL, `settledAt` datetime(6) NULL, `isSettled` tinyint NOT NULL, `retries` int NOT NULL, `attempts` int NOT NULL, `id` int NOT NULL AUTO_INCREMENT, PRIMARY KEY (`id`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `zone_members_country` (`zoneId` int NOT NULL, `countryId` int NOT NULL, INDEX `IDX_7350d77b6474313fbbaf4b094c` (`zoneId`), INDEX `IDX_7baeecaf955e54bec73f998b0d` (`countryId`), PRIMARY KEY (`zoneId`, `countryId`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `role_channels_channel` (`roleId` int NOT NULL, `channelId` int NOT NULL, INDEX `IDX_bfd2a03e9988eda6a9d1176011` (`roleId`), INDEX `IDX_e09dfee62b158307404202b43a` (`channelId`), PRIMARY KEY (`roleId`, `channelId`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `collection_product_variants_product_variant` (`collectionId` int NOT NULL, `productVariantId` int NOT NULL, INDEX `IDX_6faa7b72422d9c4679e2f186ad` (`collectionId`), INDEX `IDX_fb05887e2867365f236d7dd95e` (`productVariantId`), PRIMARY KEY (`collectionId`, `productVariantId`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `collection_channels_channel` (`collectionId` int NOT NULL, `channelId` int NOT NULL, INDEX `IDX_cdbf33ffb5d451916125152008` (`collectionId`), INDEX `IDX_7216ab24077cf5cbece7857dbb` (`channelId`), PRIMARY KEY (`collectionId`, `channelId`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `product_variant_options_product_option` (`productVariantId` int NOT NULL, `productOptionId` int NOT NULL, INDEX `IDX_526f0131260eec308a3bd2b61b` (`productVariantId`), INDEX `IDX_e96a71affe63c97f7fa2f076da` (`productOptionId`), PRIMARY KEY (`productVariantId`, `productOptionId`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `product_variant_facet_values_facet_value` (`productVariantId` int NOT NULL, `facetValueId` int NOT NULL, INDEX `IDX_69567bc225b6bbbd732d6c5455` (`productVariantId`), INDEX `IDX_0d641b761ed1dce4ef3cd33d55` (`facetValueId`), PRIMARY KEY (`productVariantId`, `facetValueId`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `product_facet_values_facet_value` (`productId` int NOT NULL, `facetValueId` int NOT NULL, INDEX `IDX_6a0558e650d75ae639ff38e413` (`productId`), INDEX `IDX_06e7d73673ee630e8ec50d0b29` (`facetValueId`), PRIMARY KEY (`productId`, `facetValueId`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `product_channels_channel` (`productId` int NOT NULL, `channelId` int NOT NULL, INDEX `IDX_26d12be3b5fec6c4adb1d79284` (`productId`), INDEX `IDX_a51dfbd87c330c075c39832b6e` (`channelId`), PRIMARY KEY (`productId`, `channelId`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `user_roles_role` (`userId` int NOT NULL, `roleId` int NOT NULL, INDEX `IDX_5f9286e6c25594c6b88c108db7` (`userId`), INDEX `IDX_4be2f7adf862634f5f803d246b` (`roleId`), PRIMARY KEY (`userId`, `roleId`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `promotion_channels_channel` (`promotionId` int NOT NULL, `channelId` int NOT NULL, INDEX `IDX_6d9e2c39ab12391aaa374bcdaa` (`promotionId`), INDEX `IDX_0eaaf0f4b6c69afde1e88ffb52` (`channelId`), PRIMARY KEY (`promotionId`, `channelId`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `shipping_method_channels_channel` (`shippingMethodId` int NOT NULL, `channelId` int NOT NULL, INDEX `IDX_f0a17b94aa5a162f0d422920eb` (`shippingMethodId`), INDEX `IDX_f2b98dfb56685147bed509acc3` (`channelId`), PRIMARY KEY (`shippingMethodId`, `channelId`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `order_promotions_promotion` (`orderId` int NOT NULL, `promotionId` int NOT NULL, INDEX `IDX_67be0e40122ab30a62a9817efe` (`orderId`), INDEX `IDX_2c26b988769c0e3b0120bdef31` (`promotionId`), PRIMARY KEY (`orderId`, `promotionId`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `order_channels_channel` (`orderId` int NOT NULL, `channelId` int NOT NULL, INDEX `IDX_0d8e5c204480204a60e151e485` (`orderId`), INDEX `IDX_d0d16db872499e83b15999f8c7` (`channelId`), PRIMARY KEY (`orderId`, `channelId`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `customer_groups_customer_group` (`customerId` int NOT NULL, `customerGroupId` int NOT NULL, INDEX `IDX_b823a3c8bf3b78d3ed68736485` (`customerId`), INDEX `IDX_85feea3f0e5e82133605f78db0` (`customerGroupId`), PRIMARY KEY (`customerId`, `customerGroupId`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'CREATE TABLE `customer_channels_channel` (`customerId` int NOT NULL, `channelId` int NOT NULL, INDEX `IDX_a842c9fe8cd4c8ff31402d172d` (`customerId`), INDEX `IDX_dc9f69207a8867f83b0fd257e3` (`channelId`), PRIMARY KEY (`customerId`, `channelId`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `country_translation` ADD CONSTRAINT `FK_20958e5bdb4c996c18ca63d18e4` FOREIGN KEY (`baseId`) REFERENCES `country`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `channel` ADD CONSTRAINT `FK_afe9f917a1c82b9e9e69f7c6129` FOREIGN KEY (`defaultTaxZoneId`) REFERENCES `zone`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `channel` ADD CONSTRAINT `FK_c9ca2f58d4517460435cbd8b4c9` FOREIGN KEY (`defaultShippingZoneId`) REFERENCES `zone`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `facet_translation` ADD CONSTRAINT `FK_eaea53f44bf9e97790d38a3d68f` FOREIGN KEY (`baseId`) REFERENCES `facet`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `facet_value_translation` ADD CONSTRAINT `FK_3d6e45823b65de808a66cb1423b` FOREIGN KEY (`baseId`) REFERENCES `facet_value`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `facet_value` ADD CONSTRAINT `FK_d101dc2265a7341be3d94968c5b` FOREIGN KEY (`facetId`) REFERENCES `facet`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_option_translation` ADD CONSTRAINT `FK_a79a443c1f7841f3851767faa6d` FOREIGN KEY (`baseId`) REFERENCES `product_option`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_option` ADD CONSTRAINT `FK_a6debf9198e2fbfa006aa10d710` FOREIGN KEY (`groupId`) REFERENCES `product_option_group`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_option_group_translation` ADD CONSTRAINT `FK_93751abc1451972c02e033b766c` FOREIGN KEY (`baseId`) REFERENCES `product_option_group`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_option_group` ADD CONSTRAINT `FK_a6e91739227bf4d442f23c52c75` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `collection_asset` ADD CONSTRAINT `FK_51da53b26522dc0525762d2de8e` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `collection_asset` ADD CONSTRAINT `FK_1ed9e48dfbf74b5fcbb35d3d686` FOREIGN KEY (`collectionId`) REFERENCES `collection`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `collection_translation` ADD CONSTRAINT `FK_e329f9036210d75caa1d8f2154a` FOREIGN KEY (`baseId`) REFERENCES `collection`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `collection` ADD CONSTRAINT `FK_7256fef1bb42f1b38156b7449f5` FOREIGN KEY (`featuredAssetId`) REFERENCES `asset`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `collection` ADD CONSTRAINT `FK_4257b61275144db89fa0f5dc059` FOREIGN KEY (`parentId`) REFERENCES `collection`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `stock_movement` ADD CONSTRAINT `FK_e65ba3882557cab4febb54809bb` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `stock_movement` ADD CONSTRAINT `FK_cbb0990e398bf7713aebdd38482` FOREIGN KEY (`orderItemId`) REFERENCES `order_item`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant_asset` ADD CONSTRAINT `FK_10b5a2e3dee0e30b1e26c32f5c7` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant_asset` ADD CONSTRAINT `FK_fa21412afac15a2304f3eb35feb` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant_price` ADD CONSTRAINT `FK_e6126cd268aea6e9b31d89af9ab` FOREIGN KEY (`variantId`) REFERENCES `product_variant`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant_translation` ADD CONSTRAINT `FK_420f4d6fb75d38b9dca79bc43b4` FOREIGN KEY (`baseId`) REFERENCES `product_variant`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant` ADD CONSTRAINT `FK_0e6f516053cf982b537836e21cf` FOREIGN KEY (`featuredAssetId`) REFERENCES `asset`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant` ADD CONSTRAINT `FK_e38dca0d82fd64c7cf8aac8b8ef` FOREIGN KEY (`taxCategoryId`) REFERENCES `tax_category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant` ADD CONSTRAINT `FK_6e420052844edf3a5506d863ce6` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_asset` ADD CONSTRAINT `FK_5888ac17b317b93378494a10620` FOREIGN KEY (`assetId`) REFERENCES `asset`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_asset` ADD CONSTRAINT `FK_0d1294f5c22a56da7845ebab72c` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_translation` ADD CONSTRAINT `FK_7dbc75cb4e8b002620c4dbfdac5` FOREIGN KEY (`baseId`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product` ADD CONSTRAINT `FK_91a19e6613534949a4ce6e76ff8` FOREIGN KEY (`featuredAssetId`) REFERENCES `asset`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product` ADD CONSTRAINT `FK_cbb5d890de1519efa20c42bcd52` FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `authentication_method` ADD CONSTRAINT `FK_00cbe87bc0d4e36758d61bd31d6` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `administrator` ADD CONSTRAINT `FK_1966e18ce6a39a82b19204704d7` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `payment` ADD CONSTRAINT `FK_d09d285fe1645cd2f0db811e293` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `refund` ADD CONSTRAINT `FK_1c6932a756108788a361e7d4404` FOREIGN KEY (`paymentId`) REFERENCES `payment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_69384323444206753f0cdeb64e0` FOREIGN KEY (`lineId`) REFERENCES `order_line`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_eed51be48640c21e1c76d3e9fbe` FOREIGN KEY (`fulfillmentId`) REFERENCES `fulfillment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` ADD CONSTRAINT `FK_3e5161133689fba526377cbccd3` FOREIGN KEY (`refundId`) REFERENCES `refund`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_line` ADD CONSTRAINT `FK_cbcd22193eda94668e84d33f185` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_line` ADD CONSTRAINT `FK_77be94ce9ec6504466179462275` FOREIGN KEY (`taxCategoryId`) REFERENCES `tax_category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_line` ADD CONSTRAINT `FK_9f065453910ea77d4be8e92618f` FOREIGN KEY (`featuredAssetId`) REFERENCES `asset`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_line` ADD CONSTRAINT `FK_239cfca2a55b98b90b6bef2e44f` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order` ADD CONSTRAINT `FK_124456e637cca7a415897dce659` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order` ADD CONSTRAINT `FK_4af424d3e7b2c3cb26e075e20fc` FOREIGN KEY (`shippingMethodId`) REFERENCES `shipping_method`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `customer` ADD CONSTRAINT `FK_3f62b42ed23958b120c235f74df` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `address` ADD CONSTRAINT `FK_dc34d382b493ade1f70e834c4d3` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `address` ADD CONSTRAINT `FK_d87215343c3a3a67e6a0b7f3ea9` FOREIGN KEY (`countryId`) REFERENCES `country`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `session` ADD CONSTRAINT `FK_7a75399a4f4ffa48ee02e98c059` FOREIGN KEY (`activeOrderId`) REFERENCES `order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `session` ADD CONSTRAINT `FK_eb87ef1e234444728138302263b` FOREIGN KEY (`activeChannelId`) REFERENCES `channel`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `session` ADD CONSTRAINT `FK_3d2f174ef04fb312fdebd0ddc53` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `tax_rate` ADD CONSTRAINT `FK_7ee3306d7638aa85ca90d672198` FOREIGN KEY (`categoryId`) REFERENCES `tax_category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `tax_rate` ADD CONSTRAINT `FK_9872fc7de2f4e532fd3230d1915` FOREIGN KEY (`zoneId`) REFERENCES `zone`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `tax_rate` ADD CONSTRAINT `FK_8b5ab52fc8887c1a769b9276caf` FOREIGN KEY (`customerGroupId`) REFERENCES `customer_group`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `history_entry` ADD CONSTRAINT `FK_92f8c334ef06275f9586fd01832` FOREIGN KEY (`administratorId`) REFERENCES `administrator`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `history_entry` ADD CONSTRAINT `FK_43ac602f839847fdb91101f30ec` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `history_entry` ADD CONSTRAINT `FK_3a05127e67435b4d2332ded7c9e` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `zone_members_country` ADD CONSTRAINT `FK_7350d77b6474313fbbaf4b094c1` FOREIGN KEY (`zoneId`) REFERENCES `zone`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `zone_members_country` ADD CONSTRAINT `FK_7baeecaf955e54bec73f998b0d5` FOREIGN KEY (`countryId`) REFERENCES `country`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `role_channels_channel` ADD CONSTRAINT `FK_bfd2a03e9988eda6a9d11760119` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `role_channels_channel` ADD CONSTRAINT `FK_e09dfee62b158307404202b43a5` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `collection_product_variants_product_variant` ADD CONSTRAINT `FK_6faa7b72422d9c4679e2f186ad1` FOREIGN KEY (`collectionId`) REFERENCES `collection`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `collection_product_variants_product_variant` ADD CONSTRAINT `FK_fb05887e2867365f236d7dd95ee` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `collection_channels_channel` ADD CONSTRAINT `FK_cdbf33ffb5d4519161251520083` FOREIGN KEY (`collectionId`) REFERENCES `collection`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `collection_channels_channel` ADD CONSTRAINT `FK_7216ab24077cf5cbece7857dbbd` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant_options_product_option` ADD CONSTRAINT `FK_526f0131260eec308a3bd2b61b6` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant_options_product_option` ADD CONSTRAINT `FK_e96a71affe63c97f7fa2f076dac` FOREIGN KEY (`productOptionId`) REFERENCES `product_option`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant_facet_values_facet_value` ADD CONSTRAINT `FK_69567bc225b6bbbd732d6c5455b` FOREIGN KEY (`productVariantId`) REFERENCES `product_variant`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant_facet_values_facet_value` ADD CONSTRAINT `FK_0d641b761ed1dce4ef3cd33d559` FOREIGN KEY (`facetValueId`) REFERENCES `facet_value`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_facet_values_facet_value` ADD CONSTRAINT `FK_6a0558e650d75ae639ff38e413a` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_facet_values_facet_value` ADD CONSTRAINT `FK_06e7d73673ee630e8ec50d0b29f` FOREIGN KEY (`facetValueId`) REFERENCES `facet_value`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_channels_channel` ADD CONSTRAINT `FK_26d12be3b5fec6c4adb1d792844` FOREIGN KEY (`productId`) REFERENCES `product`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_channels_channel` ADD CONSTRAINT `FK_a51dfbd87c330c075c39832b6e7` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `user_roles_role` ADD CONSTRAINT `FK_5f9286e6c25594c6b88c108db77` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `user_roles_role` ADD CONSTRAINT `FK_4be2f7adf862634f5f803d246b8` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `promotion_channels_channel` ADD CONSTRAINT `FK_6d9e2c39ab12391aaa374bcdaa4` FOREIGN KEY (`promotionId`) REFERENCES `promotion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `promotion_channels_channel` ADD CONSTRAINT `FK_0eaaf0f4b6c69afde1e88ffb52d` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_method_channels_channel` ADD CONSTRAINT `FK_f0a17b94aa5a162f0d422920eb2` FOREIGN KEY (`shippingMethodId`) REFERENCES `shipping_method`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_method_channels_channel` ADD CONSTRAINT `FK_f2b98dfb56685147bed509acc3d` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_promotions_promotion` ADD CONSTRAINT `FK_67be0e40122ab30a62a9817efe0` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_promotions_promotion` ADD CONSTRAINT `FK_2c26b988769c0e3b0120bdef31b` FOREIGN KEY (`promotionId`) REFERENCES `promotion`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_channels_channel` ADD CONSTRAINT `FK_0d8e5c204480204a60e151e4853` FOREIGN KEY (`orderId`) REFERENCES `order`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_channels_channel` ADD CONSTRAINT `FK_d0d16db872499e83b15999f8c7a` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `customer_groups_customer_group` ADD CONSTRAINT `FK_b823a3c8bf3b78d3ed68736485c` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `customer_groups_customer_group` ADD CONSTRAINT `FK_85feea3f0e5e82133605f78db02` FOREIGN KEY (`customerGroupId`) REFERENCES `customer_group`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `customer_channels_channel` ADD CONSTRAINT `FK_a842c9fe8cd4c8ff31402d172d7` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `customer_channels_channel` ADD CONSTRAINT `FK_dc9f69207a8867f83b0fd257e30` FOREIGN KEY (`channelId`) REFERENCES `channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      'ALTER TABLE `customer_channels_channel` DROP FOREIGN KEY `FK_dc9f69207a8867f83b0fd257e30`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `customer_channels_channel` DROP FOREIGN KEY `FK_a842c9fe8cd4c8ff31402d172d7`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `customer_groups_customer_group` DROP FOREIGN KEY `FK_85feea3f0e5e82133605f78db02`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `customer_groups_customer_group` DROP FOREIGN KEY `FK_b823a3c8bf3b78d3ed68736485c`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_channels_channel` DROP FOREIGN KEY `FK_d0d16db872499e83b15999f8c7a`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_channels_channel` DROP FOREIGN KEY `FK_0d8e5c204480204a60e151e4853`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_promotions_promotion` DROP FOREIGN KEY `FK_2c26b988769c0e3b0120bdef31b`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_promotions_promotion` DROP FOREIGN KEY `FK_67be0e40122ab30a62a9817efe0`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_method_channels_channel` DROP FOREIGN KEY `FK_f2b98dfb56685147bed509acc3d`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `shipping_method_channels_channel` DROP FOREIGN KEY `FK_f0a17b94aa5a162f0d422920eb2`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `promotion_channels_channel` DROP FOREIGN KEY `FK_0eaaf0f4b6c69afde1e88ffb52d`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `promotion_channels_channel` DROP FOREIGN KEY `FK_6d9e2c39ab12391aaa374bcdaa4`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `user_roles_role` DROP FOREIGN KEY `FK_4be2f7adf862634f5f803d246b8`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `user_roles_role` DROP FOREIGN KEY `FK_5f9286e6c25594c6b88c108db77`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_channels_channel` DROP FOREIGN KEY `FK_a51dfbd87c330c075c39832b6e7`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_channels_channel` DROP FOREIGN KEY `FK_26d12be3b5fec6c4adb1d792844`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_facet_values_facet_value` DROP FOREIGN KEY `FK_06e7d73673ee630e8ec50d0b29f`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_facet_values_facet_value` DROP FOREIGN KEY `FK_6a0558e650d75ae639ff38e413a`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant_facet_values_facet_value` DROP FOREIGN KEY `FK_0d641b761ed1dce4ef3cd33d559`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant_facet_values_facet_value` DROP FOREIGN KEY `FK_69567bc225b6bbbd732d6c5455b`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant_options_product_option` DROP FOREIGN KEY `FK_e96a71affe63c97f7fa2f076dac`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant_options_product_option` DROP FOREIGN KEY `FK_526f0131260eec308a3bd2b61b6`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `collection_channels_channel` DROP FOREIGN KEY `FK_7216ab24077cf5cbece7857dbbd`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `collection_channels_channel` DROP FOREIGN KEY `FK_cdbf33ffb5d4519161251520083`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `collection_product_variants_product_variant` DROP FOREIGN KEY `FK_fb05887e2867365f236d7dd95ee`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `collection_product_variants_product_variant` DROP FOREIGN KEY `FK_6faa7b72422d9c4679e2f186ad1`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `role_channels_channel` DROP FOREIGN KEY `FK_e09dfee62b158307404202b43a5`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `role_channels_channel` DROP FOREIGN KEY `FK_bfd2a03e9988eda6a9d11760119`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `zone_members_country` DROP FOREIGN KEY `FK_7baeecaf955e54bec73f998b0d5`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `zone_members_country` DROP FOREIGN KEY `FK_7350d77b6474313fbbaf4b094c1`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `history_entry` DROP FOREIGN KEY `FK_3a05127e67435b4d2332ded7c9e`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `history_entry` DROP FOREIGN KEY `FK_43ac602f839847fdb91101f30ec`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `history_entry` DROP FOREIGN KEY `FK_92f8c334ef06275f9586fd01832`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `tax_rate` DROP FOREIGN KEY `FK_8b5ab52fc8887c1a769b9276caf`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `tax_rate` DROP FOREIGN KEY `FK_9872fc7de2f4e532fd3230d1915`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `tax_rate` DROP FOREIGN KEY `FK_7ee3306d7638aa85ca90d672198`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `session` DROP FOREIGN KEY `FK_3d2f174ef04fb312fdebd0ddc53`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `session` DROP FOREIGN KEY `FK_eb87ef1e234444728138302263b`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `session` DROP FOREIGN KEY `FK_7a75399a4f4ffa48ee02e98c059`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `address` DROP FOREIGN KEY `FK_d87215343c3a3a67e6a0b7f3ea9`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `address` DROP FOREIGN KEY `FK_dc34d382b493ade1f70e834c4d3`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `customer` DROP FOREIGN KEY `FK_3f62b42ed23958b120c235f74df`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order` DROP FOREIGN KEY `FK_4af424d3e7b2c3cb26e075e20fc`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order` DROP FOREIGN KEY `FK_124456e637cca7a415897dce659`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_line` DROP FOREIGN KEY `FK_239cfca2a55b98b90b6bef2e44f`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_line` DROP FOREIGN KEY `FK_9f065453910ea77d4be8e92618f`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_line` DROP FOREIGN KEY `FK_77be94ce9ec6504466179462275`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_line` DROP FOREIGN KEY `FK_cbcd22193eda94668e84d33f185`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_3e5161133689fba526377cbccd3`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_eed51be48640c21e1c76d3e9fbe`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `order_item` DROP FOREIGN KEY `FK_69384323444206753f0cdeb64e0`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `refund` DROP FOREIGN KEY `FK_1c6932a756108788a361e7d4404`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `payment` DROP FOREIGN KEY `FK_d09d285fe1645cd2f0db811e293`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `administrator` DROP FOREIGN KEY `FK_1966e18ce6a39a82b19204704d7`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `authentication_method` DROP FOREIGN KEY `FK_00cbe87bc0d4e36758d61bd31d6`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product` DROP FOREIGN KEY `FK_cbb5d890de1519efa20c42bcd52`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product` DROP FOREIGN KEY `FK_91a19e6613534949a4ce6e76ff8`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_translation` DROP FOREIGN KEY `FK_7dbc75cb4e8b002620c4dbfdac5`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_asset` DROP FOREIGN KEY `FK_0d1294f5c22a56da7845ebab72c`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_asset` DROP FOREIGN KEY `FK_5888ac17b317b93378494a10620`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant` DROP FOREIGN KEY `FK_6e420052844edf3a5506d863ce6`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant` DROP FOREIGN KEY `FK_e38dca0d82fd64c7cf8aac8b8ef`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant` DROP FOREIGN KEY `FK_0e6f516053cf982b537836e21cf`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant_translation` DROP FOREIGN KEY `FK_420f4d6fb75d38b9dca79bc43b4`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant_price` DROP FOREIGN KEY `FK_e6126cd268aea6e9b31d89af9ab`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant_asset` DROP FOREIGN KEY `FK_fa21412afac15a2304f3eb35feb`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_variant_asset` DROP FOREIGN KEY `FK_10b5a2e3dee0e30b1e26c32f5c7`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `stock_movement` DROP FOREIGN KEY `FK_cbb0990e398bf7713aebdd38482`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `stock_movement` DROP FOREIGN KEY `FK_e65ba3882557cab4febb54809bb`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `collection` DROP FOREIGN KEY `FK_4257b61275144db89fa0f5dc059`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `collection` DROP FOREIGN KEY `FK_7256fef1bb42f1b38156b7449f5`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `collection_translation` DROP FOREIGN KEY `FK_e329f9036210d75caa1d8f2154a`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `collection_asset` DROP FOREIGN KEY `FK_1ed9e48dfbf74b5fcbb35d3d686`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `collection_asset` DROP FOREIGN KEY `FK_51da53b26522dc0525762d2de8e`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_option_group` DROP FOREIGN KEY `FK_a6e91739227bf4d442f23c52c75`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_option_group_translation` DROP FOREIGN KEY `FK_93751abc1451972c02e033b766c`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_option` DROP FOREIGN KEY `FK_a6debf9198e2fbfa006aa10d710`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `product_option_translation` DROP FOREIGN KEY `FK_a79a443c1f7841f3851767faa6d`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `facet_value` DROP FOREIGN KEY `FK_d101dc2265a7341be3d94968c5b`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `facet_value_translation` DROP FOREIGN KEY `FK_3d6e45823b65de808a66cb1423b`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `facet_translation` DROP FOREIGN KEY `FK_eaea53f44bf9e97790d38a3d68f`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `channel` DROP FOREIGN KEY `FK_c9ca2f58d4517460435cbd8b4c9`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `channel` DROP FOREIGN KEY `FK_afe9f917a1c82b9e9e69f7c6129`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `country_translation` DROP FOREIGN KEY `FK_20958e5bdb4c996c18ca63d18e4`',
      undefined,
    );
    await queryRunner.query(
      'DROP INDEX `IDX_dc9f69207a8867f83b0fd257e3` ON `customer_channels_channel`',
      undefined,
    );
    await queryRunner.query(
      'DROP INDEX `IDX_a842c9fe8cd4c8ff31402d172d` ON `customer_channels_channel`',
      undefined,
    );
    await queryRunner.query('DROP TABLE `customer_channels_channel`', undefined);
    await queryRunner.query(
      'DROP INDEX `IDX_85feea3f0e5e82133605f78db0` ON `customer_groups_customer_group`',
      undefined,
    );
    await queryRunner.query(
      'DROP INDEX `IDX_b823a3c8bf3b78d3ed68736485` ON `customer_groups_customer_group`',
      undefined,
    );
    await queryRunner.query('DROP TABLE `customer_groups_customer_group`', undefined);
    await queryRunner.query(
      'DROP INDEX `IDX_d0d16db872499e83b15999f8c7` ON `order_channels_channel`',
      undefined,
    );
    await queryRunner.query(
      'DROP INDEX `IDX_0d8e5c204480204a60e151e485` ON `order_channels_channel`',
      undefined,
    );
    await queryRunner.query('DROP TABLE `order_channels_channel`', undefined);
    await queryRunner.query(
      'DROP INDEX `IDX_2c26b988769c0e3b0120bdef31` ON `order_promotions_promotion`',
      undefined,
    );
    await queryRunner.query(
      'DROP INDEX `IDX_67be0e40122ab30a62a9817efe` ON `order_promotions_promotion`',
      undefined,
    );
    await queryRunner.query('DROP TABLE `order_promotions_promotion`', undefined);
    await queryRunner.query(
      'DROP INDEX `IDX_f2b98dfb56685147bed509acc3` ON `shipping_method_channels_channel`',
      undefined,
    );
    await queryRunner.query(
      'DROP INDEX `IDX_f0a17b94aa5a162f0d422920eb` ON `shipping_method_channels_channel`',
      undefined,
    );
    await queryRunner.query('DROP TABLE `shipping_method_channels_channel`', undefined);
    await queryRunner.query(
      'DROP INDEX `IDX_0eaaf0f4b6c69afde1e88ffb52` ON `promotion_channels_channel`',
      undefined,
    );
    await queryRunner.query(
      'DROP INDEX `IDX_6d9e2c39ab12391aaa374bcdaa` ON `promotion_channels_channel`',
      undefined,
    );
    await queryRunner.query('DROP TABLE `promotion_channels_channel`', undefined);
    await queryRunner.query('DROP INDEX `IDX_4be2f7adf862634f5f803d246b` ON `user_roles_role`', undefined);
    await queryRunner.query('DROP INDEX `IDX_5f9286e6c25594c6b88c108db7` ON `user_roles_role`', undefined);
    await queryRunner.query('DROP TABLE `user_roles_role`', undefined);
    await queryRunner.query(
      'DROP INDEX `IDX_a51dfbd87c330c075c39832b6e` ON `product_channels_channel`',
      undefined,
    );
    await queryRunner.query(
      'DROP INDEX `IDX_26d12be3b5fec6c4adb1d79284` ON `product_channels_channel`',
      undefined,
    );
    await queryRunner.query('DROP TABLE `product_channels_channel`', undefined);
    await queryRunner.query(
      'DROP INDEX `IDX_06e7d73673ee630e8ec50d0b29` ON `product_facet_values_facet_value`',
      undefined,
    );
    await queryRunner.query(
      'DROP INDEX `IDX_6a0558e650d75ae639ff38e413` ON `product_facet_values_facet_value`',
      undefined,
    );
    await queryRunner.query('DROP TABLE `product_facet_values_facet_value`', undefined);
    await queryRunner.query(
      'DROP INDEX `IDX_0d641b761ed1dce4ef3cd33d55` ON `product_variant_facet_values_facet_value`',
      undefined,
    );
    await queryRunner.query(
      'DROP INDEX `IDX_69567bc225b6bbbd732d6c5455` ON `product_variant_facet_values_facet_value`',
      undefined,
    );
    await queryRunner.query('DROP TABLE `product_variant_facet_values_facet_value`', undefined);
    await queryRunner.query(
      'DROP INDEX `IDX_e96a71affe63c97f7fa2f076da` ON `product_variant_options_product_option`',
      undefined,
    );
    await queryRunner.query(
      'DROP INDEX `IDX_526f0131260eec308a3bd2b61b` ON `product_variant_options_product_option`',
      undefined,
    );
    await queryRunner.query('DROP TABLE `product_variant_options_product_option`', undefined);
    await queryRunner.query(
      'DROP INDEX `IDX_7216ab24077cf5cbece7857dbb` ON `collection_channels_channel`',
      undefined,
    );
    await queryRunner.query(
      'DROP INDEX `IDX_cdbf33ffb5d451916125152008` ON `collection_channels_channel`',
      undefined,
    );
    await queryRunner.query('DROP TABLE `collection_channels_channel`', undefined);
    await queryRunner.query(
      'DROP INDEX `IDX_fb05887e2867365f236d7dd95e` ON `collection_product_variants_product_variant`',
      undefined,
    );
    await queryRunner.query(
      'DROP INDEX `IDX_6faa7b72422d9c4679e2f186ad` ON `collection_product_variants_product_variant`',
      undefined,
    );
    await queryRunner.query('DROP TABLE `collection_product_variants_product_variant`', undefined);
    await queryRunner.query(
      'DROP INDEX `IDX_e09dfee62b158307404202b43a` ON `role_channels_channel`',
      undefined,
    );
    await queryRunner.query(
      'DROP INDEX `IDX_bfd2a03e9988eda6a9d1176011` ON `role_channels_channel`',
      undefined,
    );
    await queryRunner.query('DROP TABLE `role_channels_channel`', undefined);
    await queryRunner.query(
      'DROP INDEX `IDX_7baeecaf955e54bec73f998b0d` ON `zone_members_country`',
      undefined,
    );
    await queryRunner.query(
      'DROP INDEX `IDX_7350d77b6474313fbbaf4b094c` ON `zone_members_country`',
      undefined,
    );
    await queryRunner.query('DROP TABLE `zone_members_country`', undefined);
    await queryRunner.query('DROP TABLE `job_record`', undefined);
    await queryRunner.query('DROP INDEX `IDX_9a5a6a556f75c4ac7bfdd03410` ON `search_index_item`', undefined);
    await queryRunner.query('DROP INDEX `IDX_d8791f444a8bf23fe4c1bc020c` ON `search_index_item`', undefined);
    await queryRunner.query('DROP INDEX `IDX_6fb55742e13e8082954d0436dc` ON `search_index_item`', undefined);
    await queryRunner.query('DROP TABLE `search_index_item`', undefined);
    await queryRunner.query('DROP INDEX `IDX_f3a761f6bcfabb474b11e1e51f` ON `history_entry`', undefined);
    await queryRunner.query('DROP TABLE `history_entry`', undefined);
    await queryRunner.query('DROP TABLE `global_settings`', undefined);
    await queryRunner.query('DROP TABLE `tax_rate`', undefined);
    await queryRunner.query('DROP INDEX `IDX_e5598363000cab9d9116bd5835` ON `session`', undefined);
    await queryRunner.query('DROP INDEX `IDX_232f8e85d7633bd6ddfad42169` ON `session`', undefined);
    await queryRunner.query('DROP TABLE `session`', undefined);
    await queryRunner.query('DROP TABLE `payment_method`', undefined);
    await queryRunner.query('DROP TABLE `address`', undefined);
    await queryRunner.query('DROP INDEX `REL_3f62b42ed23958b120c235f74d` ON `customer`', undefined);
    await queryRunner.query('DROP TABLE `customer`', undefined);
    await queryRunner.query('DROP TABLE `order`', undefined);
    await queryRunner.query('DROP TABLE `shipping_method`', undefined);
    await queryRunner.query('DROP TABLE `promotion`', undefined);
    await queryRunner.query('DROP TABLE `order_line`', undefined);
    await queryRunner.query('DROP TABLE `order_item`', undefined);
    await queryRunner.query('DROP TABLE `refund`', undefined);
    await queryRunner.query('DROP TABLE `payment`', undefined);
    await queryRunner.query('DROP TABLE `fulfillment`', undefined);
    await queryRunner.query('DROP TABLE `customer_group`', undefined);
    await queryRunner.query('DROP INDEX `REL_1966e18ce6a39a82b19204704d` ON `administrator`', undefined);
    await queryRunner.query('DROP INDEX `IDX_154f5c538b1576ccc277b1ed63` ON `administrator`', undefined);
    await queryRunner.query('DROP TABLE `administrator`', undefined);
    await queryRunner.query(
      'DROP INDEX `IDX_a23445b2c942d8dfcae15b8de2` ON `authentication_method`',
      undefined,
    );
    await queryRunner.query('DROP TABLE `authentication_method`', undefined);
    await queryRunner.query('DROP TABLE `user`', undefined);
    await queryRunner.query('DROP TABLE `product`', undefined);
    await queryRunner.query(
      'DROP INDEX `IDX_42187bb72520a713d625389489` ON `product_translation`',
      undefined,
    );
    await queryRunner.query('DROP TABLE `product_translation`', undefined);
    await queryRunner.query('DROP TABLE `product_asset`', undefined);
    await queryRunner.query('DROP TABLE `product_variant`', undefined);
    await queryRunner.query('DROP TABLE `product_variant_translation`', undefined);
    await queryRunner.query('DROP TABLE `product_variant_price`', undefined);
    await queryRunner.query('DROP TABLE `product_variant_asset`', undefined);
    await queryRunner.query('DROP TABLE `tax_category`', undefined);
    await queryRunner.query('DROP INDEX `IDX_94e15d5f12d355d117390131ac` ON `stock_movement`', undefined);
    await queryRunner.query('DROP INDEX `REL_cbb0990e398bf7713aebdd3848` ON `stock_movement`', undefined);
    await queryRunner.query('DROP TABLE `stock_movement`', undefined);
    await queryRunner.query('DROP TABLE `collection`', undefined);
    await queryRunner.query('DROP TABLE `collection_translation`', undefined);
    await queryRunner.query('DROP TABLE `collection_asset`', undefined);
    await queryRunner.query('DROP TABLE `product_option_group`', undefined);
    await queryRunner.query('DROP TABLE `product_option_group_translation`', undefined);
    await queryRunner.query('DROP TABLE `product_option`', undefined);
    await queryRunner.query('DROP TABLE `product_option_translation`', undefined);
    await queryRunner.query('DROP TABLE `facet_value`', undefined);
    await queryRunner.query('DROP TABLE `facet_value_translation`', undefined);
    await queryRunner.query('DROP INDEX `IDX_0c9a5d053fdf4ebb5f0490b40f` ON `facet`', undefined);
    await queryRunner.query('DROP TABLE `facet`', undefined);
    await queryRunner.query('DROP TABLE `facet_translation`', undefined);
    await queryRunner.query('DROP TABLE `asset`', undefined);
    await queryRunner.query('DROP TABLE `role`', undefined);
    await queryRunner.query('DROP INDEX `IDX_842699fce4f3470a7d06d89de8` ON `channel`', undefined);
    await queryRunner.query('DROP INDEX `IDX_06127ac6c6d913f4320759971d` ON `channel`', undefined);
    await queryRunner.query('DROP TABLE `channel`', undefined);
    await queryRunner.query('DROP TABLE `zone`', undefined);
    await queryRunner.query('DROP TABLE `country`', undefined);
    await queryRunner.query('DROP TABLE `country_translation`', undefined);
  }
}
