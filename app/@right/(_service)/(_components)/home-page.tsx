// @/app/@right/default.tsx
"use client";

import { useTranslation } from "../(_libs)/translation";

export default function HomePage() {
  const { t } = useTranslation();
  return (
    <>
      <div className=" w-full  my-4 mt-12 ">
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-5xl">
          {t("evolvingAIAgentArchitecture")}
        </h1>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("heroTagline")}</strong>
        </p>

        <blockquote className="mt-6 border-l-2 pl-6 italic">
          &quot;{t("welcomeGPL")} &quot; {t("useChatbotForInfo")} &quot;
          {t("joinTheAction")}&quot; 🔥🔥🔥
        </blockquote>

        <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0 underline text-blue-600 my-4 ">
          <a
            href="https://github.com/aifa-agi/aifa"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            GitHub https://github.com/aifa-agi/aifa
          </a>
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("heroDescription")}
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("paradigmShiftTitle")}
        </h2>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("modernWebProblemTitle")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("traditionalWebProblemPart1")}
          <strong>{t("askAndReceive")}</strong>
          {t("traditionalWebProblemPart2")}
          <strong>{t("expressNeeds")}</strong>
          {t("traditionalWebProblemPart3")}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("toolsCritique")}
        </p>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("aifaRevolutionTitle")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("aifaParadigmFlip")}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("leftSideTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("leftSidePoint1")}</li>
          <li>{t("leftSidePoint2")}</li>
          <li>{t("leftSidePoint3")}</li>
          <li>{t("leftSidePoint4")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("rightSideTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("rightSidePoint1")}</li>
          <li>{t("rightSidePoint2")}</li>
          <li>{t("rightSidePoint3")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("rethinkingInteraction")}
        </p>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("syncTitle")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("syncDescription")}
          <strong>{t("perfectSync")}</strong>
          {"."}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("whenChatbotActsTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("chatbotActsPoint1")}</li>
          <li>{t("chatbotActsPoint2")}</li>
          <li>{t("chatbotActsPoint3")}</li>
          <li>{t("chatbotActsPoint4")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("whenUserClicksTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("userClicksPoint1")}</li>
          <li>{t("userClicksPoint2")}</li>
          <li>{t("userClicksPoint3")}</li>
          <li>{t("userClicksPoint4")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("smartInterfaceExperience")}
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("twoAppsEcosystemTitle")}
        </h2>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("app1ArchitectWorkshopTitle")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("forCreatorsVisionaries")}</strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("app1Description")}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("interfaceStructureTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            <strong>{t("leftPanelDevAssistant")}</strong>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
              <li>{t("understandsBusinessGoals")}</li>
              <li>{t("suggestsOptimalArchitecture")}</li>
              <li>{t("generatesAppModules")}</li>
              <li>{t("managesVisualStructure")}</li>
              <li>{t("explainsComponentConnections")}</li>
              <li>{t("reactsInRealTime")}</li>
            </ul>
          </li>
          <li>
            <strong>{t("rightPanelThreeTabs")}</strong>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
              <li>{t("projectVisualization")}</li>
              <li>{t("adminPanelPreview")}</li>
              <li>{t("publicSitePreview")}</li>
            </ul>
          </li>
        </ul>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("app2LivePlatformTitle")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("forEndUsersCommunity")}</strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("app2Description")}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("multiLevelRoleExperience")}</strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("forAdminsTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("adminPoint1")}</li>
          <li>{t("adminPoint2")}</li>
          <li>{t("adminPoint3")}</li>
          <li>{t("adminPoint4")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("forEditorsTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("editorPoint1")}</li>
          <li>{t("editorPoint2")}</li>
          <li>{t("editorPoint3")}</li>
          <li>{t("editorPoint4")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("forRegisteredUsersTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("registeredPoint1")}</li>
          <li>{t("registeredPoint2")}</li>
          <li>{t("registeredPoint3")}</li>
          <li>{t("registeredPoint4")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("forVisitorsTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("visitorPoint1")}</li>
          <li>{t("visitorPoint2")}</li>
          <li>{t("visitorPoint3")}</li>
          <li>{t("visitorPoint4")}</li>
        </ul>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("aifaFeaturesTitle")}
        </h2>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("feature1ZeroDevOpsTitle")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("oneClickProdReady")}</strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("zeroDevOpsDescription")}
        </p>

        <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
          <li>{t("zeroDevOpsStep1")}</li>
          <li>{t("zeroDevOpsStep2")}</li>
          <li>{t("zeroDevOpsStep3")}</li>
        </ol>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("whatHappensOnClickTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("onClickStep1")}</li>
          <li>
            {t("onClickStep2")}
            <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
              <li>{t("appBuilderDeploy")}</li>
              <li>{t("saasDeploy")}</li>
            </ul>
          </li>
          <li>
            {t("onClickStep3")}
            <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
              <li>{t("secretOpenAI")}</li>
              <li>{t("secretStripe")}</li>
              <li>{t("secretResend")}</li>
              <li>{t("secretVercelBlob")}</li>
              <li>{t("secretRedis")}</li>
              <li>{t("secretPostgres")}</li>
            </ul>
          </li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("requirementsTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("requirementGithub")}</li>
          <li>{t("requirementVercel")}</li>
          <li>{t("requirementNeon")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("noTechKnowledgeNeeded")}
        </p>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("feature2AIContentTitle")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("intelligentContentEcosystem")}</strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("aifaContentCreationDescription")}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("howItWorksTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("describeContentGoal")}</li>
          <li>{t("aiGeneratesStructures")}</li>
          <li>{t("seoOptimizationIncluded")}</li>
          <li>{t("autoInternalNav")}</li>
          <li>{t("contentAdaptsToBrand")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("examplesTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("exampleTestimonials")}</li>
          <li>{t("exampleProductCatalog")}</li>
          <li>{t("exampleQuizSystem")}</li>
        </ul>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("feature3QuizGenerationTitle")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("ideaToLearningInMinutes")}</strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6 italic">
          {t("quizExamplePrompt")}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("howAIWorksQuizTitle")}</strong>
        </p>

        <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
          <li>{t("quizAIstep1")}</li>
          <li>{t("quizAIstep2")}</li>
          <li>{t("quizAIstep3")}</li>
          <li>{t("quizAIstep4")}</li>
          <li>{t("quizAIstep5")}</li>
          <li>{t("quizAIstep6")}</li>
        </ol>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("monetizationReadyTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("freeBasicQuizzes")}</li>
          <li>{t("paidDetailedExplanations")}</li>
          <li>{t("premiumSeries")}</li>
          <li>{t("certificationPrograms")}</li>
        </ul>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("feature4MonetizationTitle")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("startEarningImmediately")}</strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("builtInMonetizationInfra")}
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            <strong>{t("stripeIntegrationTitle")}</strong>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
              <li>{t("oneTimePayments")}</li>
              <li>{t("subscriptions")}</li>
              <li>{t("freeTrials")}</li>
              <li>{t("autoAccessManagement")}</li>
              <li>{t("directPayouts")}</li>
            </ul>
          </li>
          <li>
            <strong>{t("threeLevelAccessControl")}</strong>
            <ul className="my-2 ml-6 list-disc [&>li]:mt-1">
              <li>{t("publicLevel")}</li>
              <li>{t("registeredLevel")}</li>
              <li>{t("premiumLevel")}</li>
            </ul>
          </li>
          <li>
            <strong>{t("revenueStreamsTitle")}</strong> {t("revenueStreams")}
          </li>
        </ul>

        <h3 className="mt-8 scroll-m-20 text-2xl font-semibold tracking-tight">
          {t("feature5MarketingAnalyticsTitle")}
        </h3>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("builtInGrowthEngine")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("abTesting")}</li>
          <li>{t("seoOptimization")}</li>
          <li>{t("loadSpeedTracking")}</li>
          <li>{t("userBehaviorAnalytics")}</li>
        </ul>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("technicalExcellenceTitle")}
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("technologiesTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("techStack1")}</li>
          <li>{t("techStack2")}</li>
          <li>{t("techStack3")}</li>
          <li>{t("techStack4")}</li>
          <li>{t("techStack5")}</li>
          <li>{t("techStack6")}</li>
          <li>{t("techStack7")}</li>
        </ul>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("optimizationsTitle")}</strong>
        </p>

        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>{t("optimization1")}</li>
          <li>{t("optimization2")}</li>
          <li>{t("optimization3")}</li>
          <li>{t("optimization4")}</li>
        </ul>
        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("whyAifaIsBetterTitle")}
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("forV0Users")}</strong> {t("forV0UsersBenefit")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("forBeginners")}</strong> {t("forBeginnersBenefit")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("vsClassicBuilders")}</strong>{" "}
          {t("vsClassicBuildersBenefit")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("vsCustomDev")}</strong> {t("vsCustomDevBenefit")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("vsSaaS")}</strong> {t("vsSaaSBenefit")}
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("idealForAllProductsTitle")}
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("useCaseContent")}</strong> {t("useCaseContentDesc")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("useCaseECommerce")}</strong> {t("useCaseECommerceDesc")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("useCaseCommunities")}</strong>{" "}
          {t("useCaseCommunitiesDesc")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("useCaseBusiness")}</strong> {t("useCaseBusinessDesc")}
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("aifaAdvantageTitle")}
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("dataTitle")}</strong> {t("dataDesc")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("financesTitle")}</strong> {t("financesDesc")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("technologyTitle")}</strong> {t("technologyDesc")}
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("howToStartTitle")}
        </h2>

        <ol className="my-6 ml-6 list-decimal [&>li]:mt-2">
          <li>{t("startStep1")}</li>
          <li>{t("startStep2")}</li>
          <li>{t("startStep3")}</li>
          <li>{t("startStep4")}</li>
        </ol>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("costTitle")}
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("aifaSubscription")}</strong> {t("aifaSubscriptionDesc")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("traditionalDev")}</strong> {t("traditionalDevDesc")}
        </p>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("aifaRoi")}</strong> {t("aifaRoiDesc")}
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("futureIsDialogsTitle")}
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("futureIsDialogsDesc")}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("transformationLeaderQuestion")}</strong>
        </p>

        <h2 className="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          {t("readyToBuildTitle")}
        </h2>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          {t("readyToBuildDesc")}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("joinCommunity")}</strong>
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("smartExperiencesWin")}</strong>
        </p>

        <hr className="my-8" />

        <p className="leading-7 italic [&:not(:first-child)]:mt-6">
          {t("finalTagline")}
        </p>

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          <strong>{t("startYourJourney")}</strong>
        </p>
      </div>
    </>
  );
}
