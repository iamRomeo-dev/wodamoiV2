/** @jsxImportSource @emotion/react */
import { ChevronLeftIcon } from "@heroicons/react/solid";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import "twin.macro";
import { useWodCreatedByIdQuery, useWodCreatorPatchMutation } from "../APIsWodCreator";
import { Button, PrimaryButton } from "../shared/Buttons";
import { FieldsetLegend, FormGroup, HelperText, Label, RequiredAsterisk } from "../shared/Form";
import { Page, PageContent } from "../shared/Page";
import { Panel, PanelContent } from "../shared/Panel";

const typeForWods = [
  {
    types: "METCON",
  },
  {
    types: "AMRAP",
  },
  {
    types: "FOR TIME",
  },
  {
    types: "EMOM",
  },
];

const WodCreatorUpdate = () => {
  const { wodId } = useParams();
  const { status, data: wodById } = useWodCreatedByIdQuery(wodId);
  const { mutate, isLoading: isSaving } = useWodCreatorPatchMutation(wodId);
  const navigate = useNavigate();
  const onSubmit = (data) => {
    mutate(
      {
        ...data,
      },
      {
        onSuccess: () => {
          navigate(`/wod-creator/${wodId}`);
        },
      }
    );
  };

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: wodById?.name,
      description: wodById?.description,
      MovementOne: wodById?.MovementOne,
      MovementTwo: wodById?.MovementTwo,
      MovementThree: wodById?.MovementThree,
      time: wodById?.time,
      wodType: wodById?.wodType,
    },
  });

  return (
    <>
      <Helmet title="Crée ton wod" />
      <Page>
        <PageContent tw="h-screen">
          <Link
            to={{
              pathname: `/wod-creator/${wodId}`,
            }}
            tw="inline-flex items-center space-x-3 text-sm font-medium text-gray-100"
          >
            <ChevronLeftIcon tw="-ml-2 h-5 w-5 text-gray-100" aria-hidden="true" />
            <span>Retour</span>
          </Link>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Panel>
              <PanelContent>
                <FieldsetLegend>Met à jour ton wod</FieldsetLegend>
                <HelperText>Informations générales le workout de ton choix.</HelperText>
                {status === "success" && (
                  <div tw="grid grid-cols-1 gap-6 mt-6">
                    <FormGroup>
                      <Label htmlFor="name">Nom</Label>
                      <input
                        tw="flex-1 block w-full text-sm z-0 focus:z-10 border-gray-300 rounded-md focus:(ring-indigo-500 border-indigo-500) disabled:(bg-gray-50 text-gray-500)"
                        {...register("name")}
                        type="text"
                        id="name"
                      />
                    </FormGroup>

                    <div tw="grid grid-cols-1 gap-6">
                      <FormGroup tw="w-full">
                        <Label htmlFor="wodType">
                          Type <RequiredAsterisk tw="text-red-500" />
                        </Label>
                        <div tw="mt-1 sm:mt-0 sm:col-span-2">
                          <select
                            {...register("wodType")}
                            id="wodType"
                            name="wodType"
                            defaultValue={wodById.wodType}
                            tw="max-w-lg focus:ring-primary-500 focus:border-primary-500 shadow-sm sm:max-w-xs sm:text-sm border-gray-300 rounded-md pr-8"
                          >
                            {typeForWods.map((option, index) => (
                              <option key={index} value={option._id}>
                                {option.types}
                              </option>
                            ))}
                          </select>
                        </div>
                      </FormGroup>

                      <FormGroup>
                        <Label htmlFor="time">Temps</Label>
                        <div tw="mt-1 sm:mt-0 sm:col-span-2">
                          <input
                            {...register("time")}
                            tw="flex-1 block w-full text-sm z-0 focus:z-10 border-gray-300 rounded-md focus:(ring-indigo-500 border-indigo-500) disabled:(bg-gray-50 text-gray-500)"
                            type="number"
                            defaultValue={wodById.time}
                            id="time"
                            min="1"
                          ></input>
                        </div>
                      </FormGroup>
                    </div>

                    <FormGroup>
                      <Label htmlFor="description">Description</Label>
                      <textarea
                        tw="flex-1 block w-full h-32 text-sm z-0 focus:z-10 border-gray-300 rounded-md focus:(ring-indigo-500 border-indigo-500) disabled:(bg-gray-50 text-gray-500)"
                        {...register("description")}
                        type="text"
                        id="description"
                      />
                    </FormGroup>
                  </div>
                )}

                <div tw="flex space-x-3 items-center justify-end mt-8">
                  <Button as={Link} to={`/wod-creator/${wodId}`} disable={isSaving}>
                    Annuler
                  </Button>
                  <PrimaryButton type="submit" disable={isSaving}>
                    Créer
                  </PrimaryButton>
                </div>
              </PanelContent>
            </Panel>
          </form>
        </PageContent>
      </Page>
    </>
  );
};

export default WodCreatorUpdate;
