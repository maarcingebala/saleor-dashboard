import React from "react";
import { useIntl } from "react-intl";

import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import { getMutationState, maybe } from "../../misc";
import CategoryCreatePage from "../components/CategoryCreatePage";
import { TypedCategoryCreateMutation } from "../mutations";
import { CategoryCreate } from "../types/CategoryCreate";
import { categoryListUrl, categoryUrl } from "../urls";

interface CategoryCreateViewProps {
  parentId: string;
}

export const CategoryCreateView: React.StatelessComponent<
  CategoryCreateViewProps
> = ({ parentId }) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const intl = useIntl();

  const handleSuccess = (data: CategoryCreate) => {
    if (data.categoryCreate.errors.length === 0) {
      notify({
        text: intl.formatMessage({
          defaultMessage: "Category created"
        })
      });
      navigate(categoryUrl(data.categoryCreate.category.id));
    }
  };
  return (
    <TypedCategoryCreateMutation onCompleted={handleSuccess}>
      {(createCategory, createCategoryResult) => {
        const errors = maybe(
          () => createCategoryResult.data.categoryCreate.errors,
          []
        );

        const formTransitionState = getMutationState(
          createCategoryResult.called,
          createCategoryResult.loading,
          errors
        );

        return (
          <>
            <WindowTitle
              title={intl.formatMessage({
                defaultMessage: "Create category",
                description: "window title"
              })}
            />
            <CategoryCreatePage
              saveButtonBarState={formTransitionState}
              errors={errors}
              disabled={createCategoryResult.loading}
              onBack={() =>
                navigate(parentId ? categoryUrl(parentId) : categoryListUrl())
              }
              onSubmit={formData =>
                createCategory({
                  variables: {
                    input: {
                      descriptionJson: JSON.stringify(formData.description),
                      name: formData.name,
                      seo: {
                        description: formData.seoDescription,
                        title: formData.seoTitle
                      }
                    },
                    parent: parentId || null
                  }
                })
              }
            />
          </>
        );
      }}
    </TypedCategoryCreateMutation>
  );
};
export default CategoryCreateView;
