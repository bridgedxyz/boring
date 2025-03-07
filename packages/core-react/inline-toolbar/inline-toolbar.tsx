import React, { forwardRef } from "react";
import styled from "@emotion/styled";
import { Editor, BubbleMenu } from "@tiptap/react";
import {
  useFloating,
  offset,
  useInteractions,
  useDismiss,
} from "@floating-ui/react-dom-interactions";
import { BoringBubbleLinkInput } from "../menu";

/* TODO: import icon somewhere else */
export function InlineToolbar(props: { editor: Editor | null }) {
  const { editor } = props;
  if (!editor) {
    return <></>;
  }

  const { view, state } = editor;
  const { from, to } = view.state.selection;
  const text = state.doc.textBetween(from, to, "");

  // - on text
  // - on image
  // - on embeddings
  // - on divider

  const isText = text && text !== "";
  const isImage = editor.isActive("image");

  return (
    <MenuWrapper tippyOptions={{ duration: 100 }} editor={editor}>
      <Items type={isText ? "text" : "other"} editor={editor} />
    </MenuWrapper>
  );
}

function LinkItem({ editor }: { editor: Editor }) {
  const { x, y, reference, floating, context } = useFloating({
    middleware: [offset({ mainAxis: 50 })],
    strategy: "absolute",
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useDismiss(context, {
      enabled: true,
      escapeKey: true,
      referencePointerDown: true,
      outsidePointerDown: true,
    }),
  ]);
  const [isOpen, setIsOpen] = React.useState(false);

  const link = editor.getAttributes("link")["href"];

  return (
    <>
      <div
        ref={floating}
        {...getFloatingProps()}
        style={{
          position: "absolute",
          display: isOpen ? "block" : "none",
          left: 0,
          // @ts-ignore
          top: y,
        }}
      >
        {isOpen && (
          <BoringBubbleLinkInput
            defaultValue={link}
            onSubmit={(v) => {
              if (v) {
                editor
                  .chain()
                  .focus()
                  .setLink({ href: v, target: "_blank" })
                  .run();
              } else {
                // if input is empty, remove link
                editor.chain().focus().unsetLink().run();
              }
            }}
          />
        )}
      </div>
      <Item
        ref={reference}
        {...getReferenceProps()}
        onClick={() => {
          setIsOpen(true);
        }}
        className={editor.isActive("link") ? "is-active" : ""}
      >
        <Icon
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.8824 3.48807C13.5871 2.19278 11.487 2.19278 10.1917 3.48807L8.64218 5.03758C8.44691 5.23284 8.44691 5.54943 8.64218 5.74469C8.83744 5.93995 9.15402 5.93995 9.34928 5.74469L10.8988 4.19518C11.8036 3.29041 13.2705 3.29041 14.1753 4.19518C15.08 5.09995 15.08 6.56687 14.1753 7.47164L11.9622 9.68474C11.0574 10.5895 9.59047 10.5895 8.6857 9.68474C8.49061 9.48965 8.17399 9.48997 7.97891 9.68505C7.78382 9.88014 7.7835 10.1968 7.97859 10.3918C9.27389 11.6871 11.374 11.6871 12.6693 10.3918L14.8824 8.17875C16.1777 6.88346 16.1777 4.78337 14.8824 3.48807ZM3.15897 14.5979C4.45427 15.8932 6.55436 15.8932 7.84965 14.5979L9.39916 13.0484C9.59442 12.8532 9.59442 12.5366 9.39916 12.3413C9.2039 12.1461 8.88731 12.1461 8.69205 12.3413L7.14254 13.8908C6.23777 14.7956 4.77085 14.7956 3.86608 13.8908C2.96131 12.9861 2.96131 11.5191 3.86608 10.6144L6.07917 8.40126C6.98394 7.49649 8.45087 7.49649 9.35564 8.40126C9.55073 8.59635 9.86734 8.59604 10.0624 8.40095C10.2575 8.20586 10.2578 7.88925 10.0627 7.69416C8.76745 6.39886 6.66736 6.39886 5.37207 7.69416L3.15897 9.90725C1.86368 11.2025 1.86368 13.3026 3.15897 14.5979Z"
            fill="#535455"
          />
        </Icon>
        <Link>Link</Link>
      </Item>
    </>
  );
}

function Items({
  editor,
  type,
}: {
  editor: Editor;
  type: "text" | "image" | "other";
}) {
  const isLink = editor.isActive("link");
  const isBlockquote = editor.isActive("blockquote");
  const isBold = editor.isActive("bold");
  const isItalic = editor.isActive("italic");
  const isUnderline = editor.isActive("underline");
  const isStrike = editor.isActive("strike");
  const isH1 = editor.isActive("heading", { level: 1 });
  const isH2 = editor.isActive("heading", { level: 2 });

  switch (type) {
    case "text": {
      return (
        <>
          <LinkItem editor={editor} />
          <Divider />
          <Item
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={isBlockquote ? "is-active" : ""}
          >
            <Icon id="ic_text_quote" width="18" height="18" viewBox="0 0 18 18">
              <path
                d="M7.86035 5.83594C6.96191 6.00521 6.3304 6.65625 5.96582 7.78906C5.78353 8.34896 5.69238 8.90234 5.69238 9.44922C5.69238 9.51432 5.69238 9.57292 5.69238 9.625C5.7054 9.66406 5.71842 9.76172 5.73145 9.91797H7.86035V14.1758H3.7002V10.25C3.7002 8.32292 4.08431 6.83854 4.85254 5.79688C5.62077 4.75521 6.62337 4.15625 7.86035 4V5.83594ZM14.4424 5.83594C13.7262 5.95312 13.1794 6.35677 12.8018 7.04688C12.4372 7.73698 12.2549 8.53125 12.2549 9.42969C12.2549 9.50781 12.2549 9.58594 12.2549 9.66406C12.2679 9.74219 12.2874 9.82682 12.3135 9.91797H14.4424V14.1758H10.2627V10.25C10.2627 8.70052 10.5882 7.32031 11.2393 6.10938C11.8903 4.88542 12.958 4.18229 14.4424 4V5.83594Z"
                fill="#535455"
              />
            </Icon>
          </Item>
          <Item
            onClick={() =>
              editor
                .chain()
                .focus()
                // @ts-ignore
                .toggleBold()
                .run()
            }
            className={isBold ? "is-active" : ""}
          >
            <Icon id="ic_text_bold" width="18" height="18" viewBox="0 0 18 18">
              <path
                d="M4 15.5909V2.5H9.24148C10.2045 2.5 11.0078 2.64276 11.6513 2.92827C12.2947 3.21378 12.7784 3.61009 13.1023 4.11719C13.4261 4.62003 13.5881 5.19957 13.5881 5.85582C13.5881 6.36719 13.4858 6.81676 13.2813 7.20455C13.0767 7.58807 12.7955 7.90341 12.4375 8.15057C12.0838 8.39347 11.679 8.56605 11.223 8.66832V8.79616C11.7216 8.81747 12.1882 8.9581 12.6229 9.21804C13.0618 9.47798 13.4176 9.84233 13.6903 10.3111C13.9631 10.7756 14.0994 11.3295 14.0994 11.973C14.0994 12.6676 13.9268 13.2876 13.5817 13.8331C13.2408 14.3743 12.7358 14.8026 12.0668 15.1179C11.3977 15.4332 10.5732 15.5909 9.59304 15.5909H4ZM6.76776 13.3281H9.02415C9.79545 13.3281 10.358 13.1811 10.7116 12.8871C11.0653 12.5888 11.2422 12.1925 11.2422 11.6982C11.2422 11.3359 11.1548 11.0163 10.9801 10.7393C10.8054 10.4624 10.5561 10.245 10.2322 10.0874C9.91264 9.92969 9.53125 9.85085 9.08807 9.85085H6.76776V13.3281ZM6.76776 7.97798H8.8196C9.19886 7.97798 9.53551 7.91193 9.82955 7.77983C10.1278 7.64347 10.3622 7.4517 10.5327 7.20455C10.7074 6.95739 10.7947 6.66122 10.7947 6.31605C10.7947 5.84304 10.6264 5.46165 10.2898 5.17188C9.95739 4.8821 9.48438 4.73722 8.87074 4.73722H6.76776V7.97798Z"
                fill="#535455"
              />
            </Icon>
          </Item>
          <Item
            onClick={() =>
              editor
                .chain()
                .focus()
                // @ts-ignore
                .toggleItalic()
                .run()
            }
            className={isItalic ? "is-active" : ""}
          >
            <Icon
              id="ic_text_italic"
              width="18"
              height="18"
              viewBox="0 0 18 18"
            >
              <path
                d="M6.7998 15.8344L8.43617 6.01625H10.3474L8.71103 15.8344H6.7998ZM9.79128 4.48216C9.4589 4.48216 9.17765 4.37136 8.94753 4.14977C8.72168 3.92392 8.61728 3.65545 8.63432 3.34437C8.65137 3.02903 8.78347 2.76056 9.03063 2.53897C9.27779 2.31312 9.56543 2.2002 9.89355 2.2002C10.2259 2.2002 10.5051 2.31312 10.7309 2.53897C10.9568 2.76056 11.0633 3.02903 11.0505 3.34437C11.0335 3.65545 10.9014 3.92392 10.6542 4.14977C10.4113 4.37136 10.1237 4.48216 9.79128 4.48216Z"
                fill="#535455"
              />
            </Icon>
          </Item>
          <Item
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={isUnderline ? "is-active" : ""}
          >
            <Icon
              id="ic_text_underline"
              width="18"
              height="18"
              viewBox="0 0 18 18"
            >
              <path
                d="M14.1379 1.5H12.1564V9.95028C12.1564 10.5426 12.0264 11.0689 11.7664 11.5291C11.5108 11.9893 11.14 12.3516 10.6542 12.6158C10.1727 12.8757 9.59954 13.0057 8.93477 13.0057C8.27426 13.0057 7.70324 12.8757 7.2217 12.6158C6.74017 12.3516 6.3673 11.9893 6.10309 11.5291C5.84315 11.0689 5.71318 10.5426 5.71318 9.95028V1.5H3.73804V10.1101C3.73804 11.0263 3.95324 11.8381 4.38363 12.5455C4.81403 13.2486 5.41915 13.8026 6.19897 14.2074C6.9788 14.608 7.89074 14.8082 8.93477 14.8082C9.98307 14.8082 10.8971 14.608 11.677 14.2074C12.4568 13.8026 13.0619 13.2486 13.4923 12.5455C13.9227 11.8381 14.1379 11.0263 14.1379 10.1101V1.5Z"
                fill="#535455"
              />
              <path
                d="M2.2998 16.5908H15.5998V15.5908H2.2998V16.5908Z"
                fill="#535455"
              />
            </Icon>
          </Item>
          <Item
            onClick={() =>
              editor
                .chain()
                .focus()
                // @ts-ignore
                .toggleStrike()
                .run()
            }
            className={isStrike ? "is-active" : ""}
          >
            <Icon
              id="ic_text_strike_through"
              width="18"
              height="18"
              viewBox="0 0 18 18"
            >
              <path
                d="M10.7344 4.47141C11.2287 4.8038 11.5099 5.27255 11.5781 5.87766H13.483C13.4659 5.17454 13.2614 4.55238 12.8693 4.01119C12.4773 3.46573 11.9403 3.03746 11.2585 2.72639C10.581 2.41531 9.79901 2.25977 8.91264 2.25977C8.0348 2.25977 7.24645 2.41744 6.54759 2.73278C5.84872 3.04386 5.29474 3.48065 4.88565 4.04315C4.47656 4.60565 4.27202 5.26403 4.27202 6.01829C4.27202 6.93022 4.5767 7.66318 5.18608 8.21715C5.30726 8.32655 5.43692 8.43072 5.57506 8.52965H3.5V9.52965H7.87429L9.22585 9.89826C9.6946 10.0218 10.1143 10.1646 10.4851 10.3265C10.8601 10.4885 11.1562 10.693 11.3736 10.9402C11.5952 11.1873 11.706 11.5048 11.706 11.8926C11.706 12.3187 11.5803 12.6916 11.3288 13.0112C11.0774 13.3265 10.7322 13.5737 10.2933 13.7527C9.85866 13.9274 9.36222 14.0147 8.80398 14.0147C8.29688 14.0147 7.83026 13.9402 7.40412 13.791C6.98224 13.6376 6.63494 13.4054 6.36222 13.0943C6.09375 12.7789 5.94034 12.3848 5.90199 11.9118H3.92045C3.96307 12.7001 4.18679 13.3819 4.59162 13.9572C4.99645 14.5282 5.55682 14.9693 6.27273 15.2804C6.98864 15.5914 7.83665 15.747 8.81676 15.747C9.83949 15.747 10.7109 15.5808 11.4311 15.2484C12.1555 14.916 12.7074 14.4622 13.0866 13.8869C13.4702 13.3116 13.6619 12.6532 13.6619 11.9118C13.6619 11.3237 13.5447 10.8187 13.3104 10.3968C13.1298 10.0658 12.9046 9.77673 12.6348 9.52965H14.5V8.52965H10.878C10.5447 8.40838 10.2177 8.30848 9.89702 8.22994L8.61861 7.89755C8.36293 7.83363 8.09659 7.75266 7.8196 7.65465C7.54261 7.55238 7.28267 7.42667 7.03977 7.27752C6.80114 7.12411 6.60724 6.93448 6.4581 6.70863C6.31321 6.48278 6.24077 6.21431 6.24077 5.90323C6.24077 5.53249 6.3473 5.20224 6.56037 4.91247C6.7777 4.61843 7.08239 4.38832 7.47443 4.22212C7.86648 4.05167 8.33097 3.96644 8.8679 3.96644C9.6179 3.96644 10.2401 4.13477 10.7344 4.47141Z"
                fill="#535455"
              />
            </Icon>
          </Item>
          <Divider />
          <Item
            onClick={() =>
              editor
                .chain()
                .focus()
                // @ts-ignore
                .toggleHeading({ level: 1 })
                .run()
            }
            className={isH1 ? "is-active" : ""}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.60303 12.6001V5.56982H5.51164V8.31604H8.03816V5.56982H9.94678V12.6001H8.03816V9.85392H5.51164V12.6001H3.60303Z"
                fill="#535455"
              />
              <path
                d="M13.9172 6.97588V12.6001H12.3904V8.38195H12.3574L11.1271 9.11793V7.82172L12.5112 6.97588H13.9172Z"
                fill="#535455"
              />
            </svg>
          </Item>
          <Item
            onClick={() =>
              editor
                .chain()
                .focus()
                // @ts-ignore
                .toggleHeading({ level: 2 })
                .run()
            }
            className={isH2 ? "is-active" : ""}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.15332 12.6001V5.56982H5.06194V8.31604H7.58845V5.56982H9.49707V12.6001H7.58845V9.85392H5.06194V12.6001H3.15332Z"
                fill="#535455"
              />
              <path
                d="M10.7103 12.6001V11.5016L12.8085 9.76604C12.9476 9.6507 13.0666 9.54268 13.1655 9.44198C13.2662 9.33946 13.343 9.23419 13.3961 9.12617C13.4511 9.01815 13.4785 8.89823 13.4785 8.76641C13.4785 8.62178 13.4474 8.4982 13.3852 8.39568C13.3247 8.29315 13.2405 8.21443 13.1325 8.1595C13.0245 8.10275 12.9 8.07437 12.759 8.07437C12.618 8.07437 12.4936 8.10275 12.3855 8.1595C12.2793 8.21626 12.197 8.29956 12.1384 8.40941C12.0798 8.51926 12.0505 8.6529 12.0505 8.81035H10.6005C10.6005 8.4149 10.6893 8.07437 10.8669 7.78876C11.0445 7.50316 11.2953 7.28346 11.6193 7.12967C11.9434 6.97588 12.3233 6.89899 12.759 6.89899C13.2094 6.89899 13.5994 6.97131 13.9289 7.11594C14.2603 7.25874 14.5157 7.46013 14.6951 7.72011C14.8763 7.98008 14.967 8.28491 14.967 8.6346C14.967 8.85063 14.9221 9.06575 14.8324 9.27996C14.7427 9.49233 14.5816 9.72759 14.3491 9.98573C14.1166 10.2439 13.7861 10.5515 13.3577 10.9085L12.8304 11.3479V11.3808H15.0274V12.6001H10.7103Z"
                fill="#535455"
              />
            </svg>
          </Item>
        </>
      );
    }
    case "image": {
      return <></>;
    }
    case "other": {
      return <></>;
    }
  }
}

// https://www.tiptap.dev/examples/menus
// @ts-ignore
const MenuWrapper = styled(BubbleMenu)`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  align-items: center;
  flex: none;
  border: 1px solid rgba(0, 0, 0, 0.02);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background-color: white;
  box-sizing: border-box;
  overflow: hidden;
`;

const Item = styled.button`
  display: flex;
  border-radius: 0px;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  border: none;
  background: none;
  gap: 4px;
  align-self: stretch;
  box-sizing: border-box;
  padding: 10px 6px;
  flex-shrink: 0;
  background-color: transparent;

  :hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
  :active {
    background-color: rgba(0, 0, 0, 0.12);
  }
  &.is-active {
    background-color: rgba(0, 0, 0, 0.1);
  }

  transition: background-color 0.1s ease-in-out;
`;

const Icon = styled.svg`
  width: 18px;
  height: 18px;
`;

const Link = styled.span`
  color: rgb(83, 84, 85);
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: Inter, sans-serif;
  font-weight: 500;
  text-align: left;
`;

const Divider = styled.div`
  width: 1px;
  margin-left: 1px;
  border-left: solid 1px rgb(237, 237, 236);
  align-self: stretch;
  flex-shrink: 0;
`;
