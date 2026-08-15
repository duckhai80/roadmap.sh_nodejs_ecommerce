import resourceModel, { Resource } from "@/models/resource.model";
import roleModel, { Role, RoleInput } from "@/models/role.model";
import { RoleType } from "@/types";
import { QueryParams } from "@/types/query.type";

export class RabcService {
  /**
   * @param {string} name
   * @param {string} slug
   * @param {string} description
   */
  static async createResource({
    name = "profile",
    slug = "p00001",
    description = "",
  }: Resource) {
    try {
      const existingResource = await resourceModel.findOne({ slug });

      if (existingResource) {
        return existingResource;
      }

      const newResource = await resourceModel.create({
        name,
        slug,
        description,
      });

      return newResource;
    } catch (error) {
      return error;
    }
  }

  /**
   * @param {string} userId
   * @param {number} limit
   * @param {number} offset
   * @param {string} search
   */
  static async findAllResources({
    userId = "0",
    limit = 30,
    offset = 0,
    search = "",
  }: QueryParams<Resource>) {
    try {
      // Check admin role

      // Get list of resources
      const resources = await resourceModel.aggregate([
        {
          $project: {
            _id: 0,
            name: "$name",
            slug: "$slug",
            description: "$description",
            resourceId: "$_id",
            createdAt: 1,
          },
        },
      ]);

      return resources;
    } catch (error) {
      return [];
    }
  }

  /**
   * @param {string} name
   * @param {string} slug
   * @param {string} description
   * @param {array} grants
   */
  static async createRole({
    name = RoleType.SHOP,
    slug = "s00001",
    description = "extend from shop or user",
    grants = [],
  }: RoleInput) {
    try {
      // Check role exist

      // Create new role
      const newRole = await roleModel.create({
        name,
        slug,
        description,
        grants,
      });

      return newRole;
    } catch (error) {
      return error;
    }
  }

  /**
   * @param {string} userId
   * @param {number} limit
   * @param {number} offset
   * @param {string} search
   */
  static async findAllRoles({
    userId = "0",
    limit = 30,
    offset = 0,
    search = "",
  }: QueryParams<Role>) {
    try {
      // Check admin role

      // Get list of roles
      const roles = await roleModel.aggregate([
        {
          $unwind: "$grants",
        },
        {
          $lookup: {
            from: "resources",
            foreignField: "_id",
            localField: "grants.resourceId",
            as: "resource",
          },
        },
        {
          $unwind: "$resource",
        },
        {
          $project: {
            role: "$name",
            resource: "$resource.name",
            actions: "$grants.actions",
            attributes: "$grants.attributes",
          },
        },
        {
          $unwind: "$actions",
        },
        {
          $project: {
            _id: 0,
            role: 1,
            resource: 1,
            action: "$actions",
            attributes: 1,
          },
        },
      ]);

      return roles;
    } catch (error) {}
  }
}

export default RabcService;
